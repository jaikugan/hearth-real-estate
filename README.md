# Harvika Real Estate Groups

A small, responsive property-search website built with plain HTML, CSS, and JavaScript. It has no runtime dependencies or build step, so it can be served as a static site by a local web server or a static hosting provider.

## Run locally

Open `index.html` in a browser. For a local HTTP server, run this from the project folder:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Features

- Browse homes, commercial property, land and bank auction properties, and filter by locality and budget (₹ lakh/crore).
- Open a property to see specs, features and, for bank auctions, reserve price, EMD and auction date.
- Enquire about a property, or send a requirement from the contact form, straight to WhatsApp.
- Save properties, sort by price, and use the responsive layout on mobile or desktop.

Business details (WhatsApp number, phone, email, address, team) and listings are at the top of `app.js`. Replace the placeholders before publishing.

Property photos and the two display fonts are loaded from external image and font hosts, so those assets require an internet connection. Listing data and saved state are demo-only and reset when the page reloads.

## Run with Docker

Build the image from the project folder:

```sh
docker build -t hearth-real-estate .
```

Start the container and publish its port 8080 on local port 8080:

```sh
docker run --rm -p 8080:8080 hearth-real-estate
```

Open `http://localhost:8080`. Stop the foreground container with `Ctrl+C`.

## Deploy to Rancher Desktop with GitHub Actions

The workflow in `.github/workflows/deploy-rancher-desktop.yml` runs on a self-hosted runner on your laptop, builds and scans the image, then commits its tag to `k8s/kustomization.yaml`. Argo CD watches `k8s/` on `main` and deploys it to the Rancher Desktop Kubernetes cluster. The workflow runs on pushes to `main` and can be started manually from the Actions tab.

One-time setup:

1. In Rancher Desktop, enable Kubernetes and select the **dockerd (moby)** container engine so locally built images are visible to the cluster.
2. Push this project to a **private** GitHub repository. Self-hosted runners execute workflow code on your laptop, so do not use them with public repositories.
3. In the repository, open **Settings → Actions → Runners → New self-hosted runner**, choose macOS, and follow the download and configure commands. When `config.sh` asks for additional labels, enter `rancher-desktop`.
4. Start the runner with `./run.sh` (or install it as a service with `./svc.sh install && ./svc.sh start`).

After a successful run, open `http://localhost:8091`. If the port is not forwarded, run:

```sh
kubectl --context rancher-desktop -n hearth port-forward service/hearth-real-estate 8091:8091
```

Remove the deployment with `kubectl --context rancher-desktop -n argocd delete application hearth-real-estate`, then `kubectl --context rancher-desktop delete namespace hearth`.

### Continuous delivery with Argo CD

One-time setup:

1. Install Argo CD:

   ```sh
   kubectl --context rancher-desktop create namespace argocd
   kubectl --context rancher-desktop apply -n argocd --server-side --force-conflicts \
     -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.5.5/manifests/install.yaml
   ```

2. Register the app: `kubectl --context rancher-desktop apply -f argocd/application.yaml`.
3. Open the UI with `kubectl --context rancher-desktop -n argocd port-forward service/argocd-server 8443:443` and go to `https://localhost:8443`. Sign in as `admin` with the password from:

   ```sh
   kubectl --context rancher-desktop -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d; echo
   ```

   Change the password after signing in, then delete the `argocd-initial-admin-secret` secret.

Argo CD reverts manual changes to the `hearth` namespace; change `k8s/` in git instead.

### Code analysis with SonarQube

Before building the image, the workflow scans the code with SonarQube and stops the deployment if the project fails its quality gate. Project settings are in `sonar-project.properties`.

One-time setup:

1. Start SonarQube Community on your laptop:

   ```sh
   docker run -d --name sonarqube --restart unless-stopped -p 9000:9000 \
     -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
     -v sonarqube_data:/opt/sonarqube/data \
     -v sonarqube_extensions:/opt/sonarqube/extensions \
     -v sonarqube_logs:/opt/sonarqube/logs \
     sonarqube:community
   ```

   SonarQube needs about 2 GB of memory; give Rancher Desktop at least 6 GB under **Preferences → Virtual Machine**.
2. Open `http://localhost:9000`, sign in as `admin` / `admin`, and set a new password.
3. Create a local project with project key `hearth-real-estate`, then generate a project analysis token under **My Account → Security**.
4. In GitHub, open **Settings → Secrets and variables → Actions**:
   - On the **Secrets** tab, add `SONAR_TOKEN` with the token.
   - On the **Variables** tab, add `SONAR_HOST_URL` with `http://localhost:9000`.

Results appear in the SonarQube dashboard after each run.

## Deployment

This is a static site: publish `index.html`, `styles.css`, and `app.js` from the repository root, or build and deploy the Docker image. No application build or package-install step is required.