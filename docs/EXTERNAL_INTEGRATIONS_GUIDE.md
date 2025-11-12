# External Integrations Guide

## Overview
This guide provides the structure and implementation approach for integrating external systems with the MedFlow platform.

## Current Integration Status

### ✅ Implemented
- Payment processing structure (Stripe-ready)
- Webhook endpoints for external notifications
- API authentication for third-party services

### 🚧 Ready for Implementation
The following integrations have the foundational structure in place:

## 1. Payment Gateway Integration (Stripe)

### Setup Steps
```bash
# Install Stripe SDK
npm install stripe @stripe/stripe-js

# Set environment variables
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Implementation Files Needed

**`/src/lib/stripe.js`**
```javascript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(amount, currency = 'usd') {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    automatic_payment_methods: { enabled: true },
  });
}

export async function createCheckoutSession(invoiceId, amount, patientEmail) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Invoice #${invoiceId}`,
        },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/portal/invoices?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/portal/invoices?payment=cancel`,
    customer_email: patientEmail,
    metadata: { invoiceId },
  });
}
```

**`/src/app/api/webhooks/stripe/route.jsx`**
```javascript
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { notifyPaymentReceived } from '@/lib/notificationService';

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const invoiceId = session.metadata.invoiceId;

      // Update invoice status
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'PAID',
          paidAmount: session.amount_total / 100,
          paidAt: new Date(),
        },
      });

      // Notify patient
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { patient: true },
      });

      await notifyPaymentReceived(
        invoice.patient.userId,
        invoice.clinicId,
        invoiceId,
        session.amount_total / 100
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }
}
```

### Frontend Payment Component
```javascript
// /src/components/PaymentButton.jsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentButton({ invoiceId, amount }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId, amount }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    
    await stripe.redirectToCheckout({ sessionId });
    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
    >
      {loading ? 'Processing...' : `Pay $${amount}`}
    </button>
  );
}
```

## 2. Insurance Provider Integration

### Supported Standards
- **HL7 FHIR R4**: Modern healthcare data exchange
- **X12 EDI**: Electronic claims submission (837, 835, 270, 271)

### Implementation Structure

**`/src/lib/insurance/fhir.js`**
```javascript
export async function verifyInsurance(patientData) {
  // Format patient data to FHIR Patient resource
  const fhirPatient = {
    resourceType: 'Patient',
    identifier: [
      {
        system: 'http://hospital.example.org',
        value: patientData.id,
      },
    ],
    name: [
      {
        family: patientData.lastName,
        given: [patientData.firstName],
      },
    ],
    birthDate: patientData.dateOfBirth,
  };

  // Call insurance provider API
  const response = await fetch(
    `${process.env.INSURANCE_API_URL}/Patient/$validate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
        'Authorization': `Bearer ${process.env.INSURANCE_API_KEY}`,
      },
      body: JSON.stringify(fhirPatient),
    }
  );

  return await response.json();
}

export async function submitClaim(claimData) {
  // Format claim to FHIR Claim resource
  const fhirClaim = {
    resourceType: 'Claim',
    status: 'active',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/claim-type',
          code: 'professional',
        },
      ],
    },
    patient: {
      reference: `Patient/${claimData.patientId}`,
    },
    created: new Date().toISOString(),
    provider: {
      reference: `Practitioner/${claimData.doctorId}`,
    },
    priority: {
      coding: [
        {
          code: 'normal',
        },
      ],
    },
    insurance: [
      {
        sequence: 1,
        focal: true,
        coverage: {
          reference: `Coverage/${claimData.insuranceId}`,
        },
      },
    ],
    item: claimData.items,
  };

  const response = await fetch(`${process.env.INSURANCE_API_URL}/Claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      'Authorization': `Bearer ${process.env.INSURANCE_API_KEY}`,
    },
    body: JSON.stringify(fhirClaim),
  });

  return await response.json();
}
```

**API Endpoint: `/src/app/api/insurance/verify/route.jsx`**
```javascript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { verifyInsurance } from '@/lib/insurance/fhir';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const result = await verifyInsurance(data);

  return NextResponse.json(result);
}
```

## 3. Wearable Device Integration

### Supported Devices
- Fitbit
- Apple Health (via HealthKit)
- Google Fit
- Samsung Health

### OAuth Flow for Fitbit

**`/src/lib/wearables/fitbit.js`**
```javascript
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_URL}/api/oauth/fitbit/callback`;

export function getFitbitAuthUrl(userId) {
  const scope = [
    'activity',
    'heartrate',
    'sleep',
    'weight',
    'profile',
  ].join(' ');

  return `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${FITBIT_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}&state=${userId}`;
}

export async function exchangeFitbitCode(code) {
  const response = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    }),
  });

  return await response.json();
}

export async function getFitbitData(accessToken, endpoint, date = 'today') {
  const response = await fetch(
    `https://api.fitbit.com/1/user/-/${endpoint}/date/${date}.json`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return await response.json();
}
```

**Database Schema Addition**
```prisma
// Add to prisma/schema.prisma
model WearableConnection {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider     String   // 'fitbit', 'apple', 'google', 'samsung'
  accessToken  String
  refreshToken String?
  expiresAt    DateTime?
  scope        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([userId, provider])
}

model HealthData {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        String   // 'steps', 'heartrate', 'sleep', 'weight'
  value       Float
  unit        String
  recordedAt  DateTime
  source      String   // 'fitbit', 'apple', 'google', 'manual'
  metadata    Json?
  createdAt   DateTime @default(now())

  @@index([userId, type, recordedAt])
}
```

**Sync Endpoint: `/src/app/api/wearables/sync/route.jsx`**
```javascript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getFitbitData } from '@/lib/wearables/fitbit';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's wearable connection
  const connection = await prisma.wearableConnection.findFirst({
    where: { userId: session.user.id },
  });

  if (!connection) {
    return NextResponse.json({ error: 'No wearable connected' }, { status: 404 });
  }

  // Sync data based on provider
  let synced = 0;

  if (connection.provider === 'fitbit') {
    // Fetch steps
    const stepsData = await getFitbitData(connection.accessToken, 'activities/steps');
    
    await prisma.healthData.create({
      data: {
        userId: session.user.id,
        type: 'steps',
        value: parseFloat(stepsData['activities-steps'][0].value),
        unit: 'steps',
        recordedAt: new Date(stepsData['activities-steps'][0].dateTime),
        source: 'fitbit',
      },
    });
    synced++;

    // Fetch heart rate
    const heartData = await getFitbitData(connection.accessToken, 'activities/heart');
    
    if (heartData['activities-heart'][0]?.value?.restingHeartRate) {
      await prisma.healthData.create({
        data: {
          userId: session.user.id,
          type: 'heartrate',
          value: parseFloat(heartData['activities-heart'][0].value.restingHeartRate),
          unit: 'bpm',
          recordedAt: new Date(heartData['activities-heart'][0].dateTime),
          source: 'fitbit',
        },
      });
      synced++;
    }
  }

  return NextResponse.json({ 
    message: 'Sync completed', 
    synced,
  });
}
```

## 4. Lab Results Integration

### HL7 V2 Messages
Support for standard lab result messages (ORU^R01)

**`/src/lib/lab/hl7Parser.js`**
```javascript
export function parseHL7Message(message) {
  const segments = message.split('\r');
  const result = {
    messageType: null,
    patient: {},
    observations: [],
  };

  segments.forEach(segment => {
    const fields = segment.split('|');
    const segmentType = fields[0];

    switch (segmentType) {
      case 'MSH': // Message Header
        result.messageType = fields[8];
        break;
      
      case 'PID': // Patient Identification
        result.patient = {
          id: fields[3],
          name: fields[5],
          dob: fields[7],
        };
        break;
      
      case 'OBR': // Observation Request
        result.orderInfo = {
          orderId: fields[2],
          testName: fields[4],
          observationDateTime: fields[7],
        };
        break;
      
      case 'OBX': // Observation Result
        result.observations.push({
          valueType: fields[2],
          identifier: fields[3],
          value: fields[5],
          units: fields[6],
          referenceRange: fields[7],
          abnormalFlag: fields[8],
          status: fields[11],
        });
        break;
    }
  });

  return result;
}
```

## 5. Telemedicine Integration

### Video Call Integration (Twilio Video)

**Setup**
```bash
npm install twilio @twilio/conversations
```

**`/src/lib/telemedicine/twilioVideo.js`**
```javascript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function createVideoRoom(appointmentId, participantIds) {
  const room = await client.video.v1.rooms.create({
    uniqueName: `appointment-${appointmentId}`,
    type: 'group',
    maxParticipants: 4,
    recordParticipantsOnConnect: true,
  });

  // Generate access tokens for participants
  const tokens = await Promise.all(
    participantIds.map(id => generateAccessToken(id, room.sid))
  );

  return {
    roomSid: room.sid,
    roomName: room.uniqueName,
    tokens,
  };
}

async function generateAccessToken(identity, roomName) {
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity }
  );

  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);

  return token.toJwt();
}
```

## Environment Variables Required

Add to `.env.local`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Insurance Provider
INSURANCE_API_URL=https://api.insurance-provider.com/fhir
INSURANCE_API_KEY=...

# Fitbit
FITBIT_CLIENT_ID=...
FITBIT_CLIENT_SECRET=...

# Twilio Video
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_API_KEY=...
TWILIO_API_SECRET=...
```

## Testing Integration Endpoints

Use the test scripts in `/tests/integration/`:

```bash
# Test Stripe webhook
npm run test:stripe

# Test insurance verification
npm run test:insurance

# Test wearable sync
npm run test:wearables
```

## Security Considerations

1. **API Keys**: Store all API keys in environment variables
2. **Webhook Signatures**: Always verify webhook signatures
3. **OAuth Tokens**: Encrypt tokens at rest in the database
4. **Rate Limiting**: Implement rate limiting for all external API calls
5. **Data Validation**: Validate all incoming data from external sources
6. **Error Handling**: Never expose internal errors to external systems
7. **Logging**: Log all external API interactions for audit trails

## Next Steps

1. Configure webhook endpoints for each integration
2. Set up test accounts with each provider
3. Implement error recovery and retry logic
4. Add monitoring for integration health
5. Create user interface for managing connections
6. Document integration setup for clinic admins

## Support

For integration issues, contact:
- Technical Support: tech@medflow.com
- Integration Team: integrations@medflow.com
