param(
    [string]$RegistryUser = "YOUR_DOCKERHUB_USER",
    [string]$Tag = "latest"
)

# Tag the local image and push to Docker Hub
docker tag clinicplatform:latest $RegistryUser/clinicplatform:$Tag
docker push $RegistryUser/clinicplatform:$Tag

Write-Host "Pushed $RegistryUser/clinicplatform:$Tag"
