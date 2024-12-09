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

