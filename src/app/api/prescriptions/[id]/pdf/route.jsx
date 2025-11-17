import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma.jsx';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prescriptionId = params.id;

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            dateOfBirth: true,
          },
        },
        doctor: {
          select: {
            name: true,
            email: true,
          },
        },
        consultation: {
          select: {
            diagnosis: true,
          },
        },
      },
    });

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    // Check authorization
    if (
      session.user.role === 'PATIENT' &&
      prescription.patientId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (
      session.user.role === 'DOCTOR' &&
      prescription.doctorId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Generate HTML for PDF
    const html = generatePrescriptionHTML(prescription);

    // For now, return HTML that can be printed or converted to PDF client-side
    // In production, you would use a library like Puppeteer or PDFKit
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="prescription-${prescriptionId}.html"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function generatePrescriptionHTML(prescription) {
  const medications = prescription.medications || [];
  const patientName = `${prescription.patient?.firstName || ''} ${prescription.patient?.lastName || ''}`.trim();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prescription - ${patientName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      background: white;
      color: #1e293b;
    }
    
    .prescription {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #10b981;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      margin-bottom: 8px;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .rx-symbol {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .content {
      padding: 30px;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .info-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;
    }
    
    .info-value {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .medications {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .medication {
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .medication:last-child {
      border-bottom: none;
    }
    
    .medication-name {
      font-size: 18px;
      font-weight: 700;
      color: #10b981;
      margin-bottom: 12px;
    }
    
    .medication-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }
    
    .detail {
      display: flex;
      flex-direction: column;
    }
    
    .detail-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    
    .detail-value {
      font-size: 14px;
      color: #1e293b;
    }
    
    .instructions {
      margin-top: 12px;
      padding: 12px;
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      border-radius: 4px;
    }
    
    .instructions-label {
      font-size: 11px;
      font-weight: 700;
      color: #92400e;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    
    .instructions-text {
      font-size: 13px;
      color: #78350f;
      line-height: 1.5;
    }
    
    .diagnosis-box {
      background: #ede9fe;
      border-left: 4px solid #8b5cf6;
      padding: 15px;
      border-radius: 4px;
    }
    
    .diagnosis-text {
      font-size: 15px;
      color: #5b21b6;
      font-weight: 500;
    }
    
    .notes-box {
      background: #f1f5f9;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #64748b;
    }
    
    .notes-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
    }
    
    .signature-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20px;
    }
    
    .signature-box {
      text-align: center;
    }
    
    .signature-line {
      width: 250px;
      border-top: 2px solid #1e293b;
      margin-bottom: 8px;
      padding-top: 40px;
    }
    
    .signature-label {
      font-size: 12px;
      color: #64748b;
    }
    
    .signature-name {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .disclaimer {
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
    
    .disclaimer-text {
      font-size: 11px;
      color: #991b1b;
      line-height: 1.5;
    }
    
    .print-date {
      text-align: right;
      font-size: 12px;
      color: #64748b;
      margin-top: 15px;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .prescription {
        border: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="prescription">
    <div class="header">
      <div class="rx-symbol">℞</div>
      <h1>Medical Prescription</h1>
      <p>MedFlow Healthcare System</p>
    </div>
    
    <div class="content">
      <!-- Patient & Doctor Information -->
      <div class="section">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Patient Name</span>
            <span class="info-value">${patientName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Patient Email</span>
            <span class="info-value">${prescription.patient?.email || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Prescribed By</span>
            <span class="info-value">Dr. ${prescription.doctor?.name || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Date</span>
            <span class="info-value">${new Date(prescription.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
      
      <!-- Diagnosis -->
      ${prescription.diagnosis || prescription.consultation?.diagnosis ? `
      <div class="section">
        <div class="section-title">Diagnosis</div>
        <div class="diagnosis-box">
          <div class="diagnosis-text">${prescription.diagnosis || prescription.consultation?.diagnosis}</div>
        </div>
      </div>
      ` : ''}
      
      <!-- Medications -->
      <div class="section">
        <div class="section-title">Prescribed Medications</div>
        <div class="medications">
          ${medications.map((med, index) => `
            <div class="medication">
              <div class="medication-name">${index + 1}. ${med.name}</div>
              <div class="medication-details">
                <div class="detail">
                  <span class="detail-label">Dosage</span>
                  <span class="detail-value">${med.dosage}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">Frequency</span>
                  <span class="detail-value">${med.frequency}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">Duration</span>
                  <span class="detail-value">${med.duration}</span>
                </div>
              </div>
              ${med.instructions ? `
                <div class="instructions">
                  <div class="instructions-label">⚠ Special Instructions</div>
                  <div class="instructions-text">${med.instructions}</div>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Additional Notes -->
      ${prescription.notes ? `
      <div class="section">
        <div class="section-title">Additional Notes</div>
        <div class="notes-box">
          <div class="notes-text">${prescription.notes}</div>
        </div>
      </div>
      ` : ''}
      
      <!-- Footer -->
      <div class="footer">
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Doctor's Signature</div>
            <div class="signature-name">Dr. ${prescription.doctor?.name || 'N/A'}</div>
          </div>
        </div>
        
        <div class="disclaimer">
          <div class="disclaimer-text">
            ⚠ This is a computer-generated prescription. Please consult your doctor if you have any questions or concerns about this medication. 
            Do not share your medications with others. Keep all medications out of reach of children.
          </div>
        </div>
        
        <div class="print-date">
          Generated on: ${new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // Auto-print functionality
    window.onload = function() {
      // Uncomment the line below to auto-print
      // window.print();
    };
  </script>
</body>
</html>
  `;
}
