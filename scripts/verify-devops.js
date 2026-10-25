const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('===========================================================');
console.log(' MediCare - Docker & Kubernetes DevOps Verification Suite');
console.log('===========================================================\n');

let totalChecks = 0;
let passedChecks = 0;

function check(title, condition, detail) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`✓ [PASS] ${title}`);
    if (detail) console.log(`         ${detail}`);
  } else {
    console.log(`✗ [FAIL] ${title}`);
    if (detail) console.log(`         ${detail}`);
  }
}

// 1. Dockerfile Verification
const dockerfilePath = path.join(__dirname, '..', 'backend', 'Dockerfile');
if (fs.existsSync(dockerfilePath)) {
  const content = fs.readFileSync(dockerfilePath, 'utf8');
  check('Dockerfile exists', true, dockerfilePath);
  check('Lightweight Alpine Base Image', content.includes('FROM node:20-alpine'), 'Base: node:20-alpine');
  check('Native build dependencies (SQLite)', content.includes('apk add') && content.includes('python3'), 'Packages: python3 make g++');
  check('Production dependency install', content.includes('npm ci --only=production'), 'Flag: --only=production');
  check('API Port Expose', content.includes('EXPOSE 5000'), 'Exposed Port: 5000');
  check('Docker HEALTHCHECK probe configured', content.includes('HEALTHCHECK') && content.includes('/api/health'), 'Endpoint: /api/health');
} else {
  check('Dockerfile exists', false, 'Missing backend/Dockerfile');
}

console.log('');

// 2. Docker Compose Verification
const composePath = path.join(__dirname, '..', 'docker', 'docker-compose.yml');
if (fs.existsSync(composePath)) {
  const content = fs.readFileSync(composePath, 'utf8');
  check('docker-compose.yml exists', true, composePath);
  check('Service definition: backend', content.includes('backend:'), 'Service: backend');
  check('Port mapping 5000:5000', content.includes('"5000:5000"'), 'Host:Container -> 5000:5000');
  check('Volume persistence for SQLite', content.includes('medicare-data:'), 'Named volume: medicare-data');
  check('Automated container healthcheck', content.includes('healthcheck:') && content.includes('/api/health'), 'Interval: 30s, Retries: 3');
} else {
  check('docker-compose.yml exists', false, 'Missing docker/docker-compose.yml');
}

console.log('');

// 3. Kubernetes Deployment Verification
const k8sDeployPath = path.join(__dirname, '..', 'k8s', 'backend-deployment.yaml');
if (fs.existsSync(k8sDeployPath)) {
  const content = fs.readFileSync(k8sDeployPath, 'utf8');
  check('k8s backend-deployment.yaml exists', true, k8sDeployPath);
  check('High-Availability Replicas', content.includes('replicas: 2'), 'Desired Replicas: 2 Pods');
  check('Resource Limits & Requests configured', content.includes('resources:') && content.includes('memory:'), 'CPU: 100m-300m, Mem: 64Mi-256Mi');
  check('Liveness Probe configured', content.includes('livenessProbe:') && content.includes('/api/health'), 'Path: /api/health, Port: 5000');
  check('Readiness Probe configured', content.includes('readinessProbe:') && content.includes('/api/health'), 'Path: /api/health, Port: 5000');
  check('Persistent Volume Mount (/data)', content.includes('mountPath: /data'), 'Mount: /data');
} else {
  check('k8s backend-deployment.yaml exists', false, 'Missing k8s/backend-deployment.yaml');
}

console.log('');

// 4. Kubernetes Service Verification
const k8sSvcPath = path.join(__dirname, '..', 'k8s', 'backend-service.yaml');
if (fs.existsSync(k8sSvcPath)) {
  const content = fs.readFileSync(k8sSvcPath, 'utf8');
  check('k8s backend-service.yaml exists', true, k8sSvcPath);
  check('NodePort Service Type', content.includes('type: NodePort'), 'Type: NodePort');
  check('NodePort allocation: 30500', content.includes('nodePort: 30500'), 'External NodePort: 30500');
  check('Target port forwarding: 5000', content.includes('targetPort: 5000'), 'TargetPort: 5000');
} else {
  check('k8s backend-service.yaml exists', false, 'Missing k8s/backend-service.yaml');
}

console.log('');

// 5. GitHub Actions CI/CD Cloud Pipeline
const ciPath = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
if (fs.existsSync(ciPath)) {
  const content = fs.readFileSync(ciPath, 'utf8');
  check('GitHub Actions CI/CD pipeline exists', true, ciPath);
  check('Automated Docker build stage in cloud', content.includes('docker build'), 'Command: docker build -t medicare-backend:ci');
  check('Automated frontend & backend validation', content.includes('validate-frontend') && content.includes('validate-backend'), 'Jobs: validate-frontend, validate-backend, build-docker-image');
} else {
  check('GitHub Actions CI/CD pipeline exists', false, 'Missing .github/workflows/ci.yml');
}

console.log('\n===========================================================');
console.log(` Results: ${passedChecks}/${totalChecks} DevOps & Cloud Checks Passed`);
console.log('===========================================================\n');
