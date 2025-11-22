Déploiement Kubernetes - guide rapide

Ce fichier explique les étapes minimales pour déployer l'application sur un cluster Kubernetes local ou distant, et comment configurer le pipeline CI/CD.

Prérequis
- `kubectl` configuré pour accéder au cluster
- Docker registry (DockerHub, GHCR, ...)

1) Hosts (local dev)
- Ajoutez dans `C:\Windows\System32\drivers\etc\hosts` :

    127.0.0.1    medflow.local

2) Mettre à jour les valeurs sensibles
- Le fichier `k8s/secret.yaml` contient des placeholders. Ne commitez pas de secrets réels.
- Pour créer le secret localement, par exemple :

    kubectl create secret generic next-secret --from-literal=NEXTAUTH_SECRET='votre_secret' --from-literal=STRIPE_SECRET_KEY='votre_stripe_secret'

3) Appliquer les manifests

    kubectl apply -f k8s/pv.yaml
    kubectl apply -f k8s/pvc.yaml
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/secret.yaml   # only if you've edited it with real values
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl apply -f k8s/ingress.yaml

4) CI/CD (GitHub Actions)
- Le workflow est défini dans `.github/workflows/deploy.yml`.
- Secrets GitHub requis:
  - `REGISTRY_USERNAME` : username du registry (dockerhub)
  - `REGISTRY_PASSWORD` : token/password du registry
  - `KUBE_CONFIG` : contenu base64 du kubeconfig (ex: cat ~/.kube/config | base64 -w0)

Workflow amélioré
- Le workflow tagge l'image avec `${{ github.sha }}` et `latest`. Il push ensuite les images, applique les manifests `k8s/` (ConfigMap/PV/PVC/Service/Ingress) puis met à jour le `Deployment` avec `kubectl set image` en utilisant le tag SHA.

Configuration des secrets GitHub
- `REGISTRY_USERNAME` : par ex. `mariemguesmi68` (votre nom DockerHub)
- `REGISTRY_PASSWORD` : créez un Docker Hub Access Token et collez-le ici
    - Pour créer un token Docker Hub : Menu Account > Security > New Access Token
- `KUBE_CONFIG` : contenu du fichier `~/.kube/config` encodé en base64 (ex: `cat ~/.kube/config | base64 -w0`). Copiez la sortie et collez-la dans le secret.

Déclencher le pipeline manuellement
- Après avoir poussé l'image sur Docker Hub (ou après que le workflow ait build/push automatiquement), poussez vos modifications sur `main` pour déclencher la GitHub Action:

        git add .
        git commit -m "ci(k8s): update manifests and CI workflow"
        git push origin main

Script local pour pousser l'image (Windows PowerShell)
- `scripts/publish_image.ps1` : permet de tagger et push l'image locale vers Docker Hub :

        pwsh .\scripts\publish_image.ps1 -RegistryUser "mariemguesmi68" -Tag "latest"

Si vous utilisez Minikube/Kind
- Vous pouvez charger l'image locale dans le cluster sans la pousser :

        # Minikube
        minikube image load clinicplatform:latest
        kubectl apply -f k8s/

        # Kind
        kind load docker-image clinicplatform:latest --name kind
        kubectl apply -f k8s/


5) Remarques
- `k8s/deployment.yaml` référence maintenant `ConfigMap` et `Secret` via `envFrom`.
- Par défaut le `Ingress` écoute `medflow.local`; adaptez `NEXTAUTH_URL` si vous déployez sur une IP publique.
- Pour des environnements de production, utilisez un registry privé, TLS sur l'ingress et ne stockez pas de secrets dans le repo.
