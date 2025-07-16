This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

if you run locally

1. Run docker desktop 
2. Run the below command to use the Qdrant database
```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/pages.tsx`. The page auto-updates as you edit the file.

If you use docker compose, run

```
docker compose up
```


## Architecture

![architecture](/public/architecture.png)

## Deployed URL



## Deploy 

1. After push changes to this repository, access to Github Action [rag-deploy](https://github.com/wcm-wig-lab/ragAI-playground/actions/workflows/rag-deploy.yaml).

2. Push Pun workflow button ![alt text](/public/image.png)

3. Access to the Inventor portal repository and rap-deploy github [action](https://github.com/wcm-wig-lab/inventor-portal/actions/workflows/rag-deploy.yaml).

4. Find the latest docker image in [Artifactory](https://artifactory.stargate.toyota/ui/native/wcm-wig-lab/inventor-portal/rag-frontend/)

![alt text](/public/image-1.png)

5. Go back to 3. and add the Image tag and run as develop environment.
![alt text](/public/image-2.png)

## Update database

Qdrant database is running in the different pod from Rag app.
If you need to update data, run the pod locally and do npm run embed-docs.

1. Make sure you are not running other application locally

2. Run Qdrant pod with the following command.
```
kubectl port-forward rag-db-0 6333:6333 --as wcm-inventor-portal-dev-admin
```

3. Run the following command to update database
```
npm run embed-docs
```

4. If you need to clean up old data from database and add new data, go to ``/lib/embedDocments.ts`` and uncomment from line 20 to 23. and run ``npm run embed-docs``.
```
  //if you want to delete data from database.
  // await qdrantClient.delete(COLLECTION_NAME, {
  //   filter: {},
  // });
  // console.log("🧹 Qdrant: delete all data！");
```
