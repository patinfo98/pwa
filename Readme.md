# Continuous Deployment Documentation

## Infrastructure Overview

The application is deployed on an AWS EC2 instance using Nginx as the web server. The deployment process is automated via GitHub Actions.

### Server Structure

- **Base Path**: `/var/www/pwa/`
  - `current/` -> Symlink to latest release
  - `releases/` -> Contains versioned releases
  - `logs/` -> Application logs

### SSL Configuration

SSL certificates are stored in `/etc/nginx/ssl/`:

- `certificate.crt` - Main certificate
- `ca_bundle.crt` - Certificate chain
- `private.key` - Private key

## Deployment Process

### Release Strategy

- Each deployment creates a new timestamped directory in `/var/www/pwa/releases/`
- The `current` symlink points to the latest release
- Only the last 5 releases are kept for rollback purposes

### GitHub Actions Workflow

The deployment is triggered automatically after successful completion of:

- "Build Project" workflow
- "Node.js CI" workflow

#### Workflow Steps

1. **Environment Setup**

   - Runs on Ubuntu latest
   - Uses Node.js 18
   - Uses npm cache for faster installations

2. **Build Process**

   ```bash
   npm ci
   NODE_ENV=production npm run build
   ```

3. **Deployment Package**

   - Creates `deployment.tar.gz` from the `dist` directory

4. **AWS Authentication**

   - Configures AWS credentials for EC2 access
   - Uses AWS region: eu-central-1

5. **EC2 Deployment**
   - Uploads package to `/tmp/` on EC2
   - Creates timestamped release directory
   - Extracts files and sets nginx:nginx ownership
   - Updates `current` symlink
   - Maintains only last 5 releases

### Security

- Uses SSH key-based authentication
- Implements StrictHostKeyChecking
- Temporary files are cleaned up after deployment

## Test Automation

### Overview

The application is equipped with an automated testing pipeline using GitHub Actions. The pipeline ensures that unit tests are executed, and coverage reports are generated for every code change (push or pull request).

Pipeline Structure
Configuration

- File: `.github/workflows/backend-tests.yml`
- Test Framework: Jest
- Test Directory: `tests/` contains all test files with the .test.js extension.
- Coverage Report: Generated in the `coverage/ directory` and uploaded as an artifact in GitHub Actions.

### Test Process

1. **Trigger Events**

#### The test workflow runs automatically on:

- push events to the main .
- pull requests targeting main .

2. **Workflow Steps**
   #### 1. Environment Setup

- Runs on `ubuntu-latest`.
- `Node.js version: 20`.
- Caches Node.js dependencies for faster builds.

  #### 2. Dependency Installation

* Uses `npm ci` for consistent and reliable installations based on `package-lock.json`.

  #### 3. Test Execution

* Executes tests with Jest:

```bash
npx jest --ci --coverage
```

- Generates a detailed coverage report in `coverage/lcov-report.`

  #### 4. Artifact Upload

- The coverage report is uploaded as an artifact for further inspection in the GitHub Actions UI.

### Technologies

- **Jest**: JavaScript testing framework for unit tests and coverage.
- **npm ci**: Ensures deterministic dependency installation, critical for CI/CD pipelines.
- **actions/cache**: Reduces build time by caching Node.js modules in `~/.npm`.
- **wait-on & http-server**: Supports front-end testing by ensuring server readiness and serving static files.

### File Structure

- **Test Directory**: `tests/` contains all test cases.
- **Mockup Tests**: Basic tests to validate the pipeline, located in `tests/mock/`.
- **Configuration Files**:
  - `jest.config.js` configures test settings and coverage parameters.
  - `.github/workflows/backend-tests.yml` defines the CI workflow.

### Rollback Procedure

If the automated tests fail:

1. Review GitHub Actions logs to identify the issue.
2. Debug locally using:

```bash
    npm ci
    npx jest --coverage
```

3. Fix issues and push the changes to re-trigger the pipeline.

### File Reference

- **Workflow File**: `.github/workflows/backend-tests.yml`
- **Test Config**: `jest.config.js`
- **Coverage Directory**: `coverage/lcov-report` (uploaded as an artifact)

## Server Configuration

### File Permissions

- Application files: `nginx:nginx`
- SSL certificates:
  - Certificate files: `nginx:nginx` (read-only)
  - Private key: `nginx:nginx` (read-only, restricted)

## Required Environment Variables

### GitHub Actions Secrets

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `SSH_PRIVATE_KEY` - SSH private key for EC2 access

### Environment Variables

- `AWS_REGION: eu-central-1`
- `EC2_HOST: ec2-3-64-57-137.eu-central-1.compute.amazonaws.com`
- `DEPLOY_PATH: /var/www/pwa`
- `SSH_USER: ec2-user`
- `AWS_PLATFORM: linux/amd64`

## Maintenance

### SSL Certificates

Location: `/etc/nginx/ssl/`

- Monitor certificate expiration dates
- Ensure proper permissions are maintained
- Keep backup of certificates

### Release Management

- Automatic cleanup keeps last 5 releases
- Manual rollback possible by updating `current` symlink
- Release directory format: `YYYYMMDD_HHMMSS`

## Rollback Procedure

1. SSH into the server
2. Navigate to `/var/www/pwa/`
3. List available releases in `releases/` directory
4. Update symlink to desired release:
   ```bash
   ln -sfn /var/www/pwa/releases/[RELEASE_TIMESTAMP] /var/www/pwa/current
   ```

## Troubleshooting

### Common Issues

1. Failed Deployment

   - Check GitHub Actions logs
   - Verify AWS credentials
   - Ensure SSH key is valid
   - Check disk space on EC2

2. Permission Issues
   - Verify nginx user ownership
   - Check SSH key permissions
   - Validate AWS IAM permissions

## Alternative Approach: ECS Continuous Deployment

For an alternative approach using Amazon ECS for containerized deployments, please refer to the [ECS CD Pipeline Documentation](./.doc/ECS.md), where we explain how to leverage Amazon ECS and GitHub Actions to automate your deployments on a serverless environment using AWS Fargate.
