# Google Cloud Deployment Guide
  
In this guide, we will deploy PeerPrep on a Google Cloud cluster.  
  
  
## Prerequesites  
1. [NPM LTS](https://nodejs.org/en/download/)  
1. [Docker](https://docs.docker.com/get-docker/)  
1. [Kubernetes](https://kubernetes.io/releases/download/)  
1. [Python](https://www.python.org/downloads/) (for installing Google Cloud SDK)  
1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

## Setting up GCP project 
First, you will need to sign into the Google Cloud Platform via the command line
```bash  
gcloud auth login 
``` 

Next, create a Google Cloud project using the following command and configure your SDK to point to the newly created project.
```bash  
gcloud projects create peerprep-321915
gcloud config set project peerprep-321915
``` 
**Note: you can replace `peerprep-321915` with any project name of your choice**

## Building the Docker images
Run the following commands at the root directory to build the Docker images for the services:
```bash  
docker build -t gcr.io/peerprep-321915/peerprep-client:latest ./frontend/app/
docker build -t gcr.io/peerprep-321915/peerprep-matching:latest ./services/matching/
docker build -t gcr.io/peerprep-321915/peerprep-editor:latest ./services/editor/
docker build -t gcr.io/peerprep-321915/peerprep-chat:latest ./services/chat/
``` 

## Pushing the Docker images to GCR
Run the following commands to push the built images to the Google Cloud Repository of your project:
```bash  
docker push gcr.io/peerprep-321915/peerprep-client
docker push gcr.io/peerprep-321915/peerprep-matching
docker push gcr.io/peerprep-321915/peerprep-editor
docker push gcr.io/peerprep-321915/peerprep-chat
```

## Deploying the services 
Run the following command to deploy the various services into the GCP:
```bash  
kubectl apply -f kubernetes/
``` 

  
### Check that the services are running correctly 
  
```bash  
kubectl get po                                   
NAME                                 READY   STATUS    RESTARTS   AGE
peerprep-chat-df7f7b6c-zt7v8         1/1     Running   0          44m
peerprep-client-cd8bb84c6-cpgxq      1/1     Running   0          44m
peerprep-editor-6dfffdb778-xsk7l     1/1     Running   0          44m
peerprep-matching-7844d89fc5-29f92   1/1     Running   0          44m
```  

### View deployed application
Once everything is running, you can view your deployed application on production by visiting the address of your ingress controller.
```bash  
kubectl get ingress
NAME               CLASS    HOSTS              ADDRESS         PORTS   AGE
ingress-peerprep   <none>   *                  34.117.253.13   80      3d11h
```  
