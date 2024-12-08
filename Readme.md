# project plan

## continious delivery workflow
- feature branches
-- pull requests with one approval
- documentation
- build automation
- test automation 
- continious deployment
- security 
-- (no upload of passwords/keys)
-- https

## division of tasks
- testing: 
    -- frontend tests (Selenium): Patrick
    -- backend tests: Dominik
- build automation (Github Actions): Susanne
- test automation: Dana
- server: Stefan

# SSL Certificate Implementation for PWA

## Overview
This documentation covers the implementation of SSL/TLS encryption and caching strategies for a Progressive Web Application (PWA) running on an AWS EC2 instance with Nginx.

## SSL Certificate Implementation
### Certificate Acquisition
1. Used ZeroSSL for certificate generation
2. Verified domain ownership through HTTP validation method
3. Generated three essential files:
    - `certificate.crt`: Main SSL certificate
    - `private.key`: Private key file
    - `ca_bundle.crt`: Certificate Authority bundle

### Certificate Installation
1. Created SSL directory on EC2:
   ```bash
   sudo mkdir -p /etc/nginx/ssl
   ```

2. Installed certificates:
   ```bash
   sudo mv certificate.crt /etc/nginx/ssl/
   sudo mv private.key /etc/nginx/ssl/
   sudo mv ca_bundle.crt /etc/nginx/ssl/
   ```

3. Set proper permissions:
   ```bash
   sudo chmod 644 /etc/nginx/ssl/certificate.crt
   sudo chmod 644 /etc/nginx/ssl/ca_bundle.crt
   sudo chmod 600 /etc/nginx/ssl/private.key
   ```

## Nginx Configuration
### SSL Settings
```nginx
ssl_certificate /etc/nginx/ssl/certificate.crt;
ssl_certificate_key /etc/nginx/ssl/private.key;
ssl_trusted_certificate /etc/nginx/ssl/ca_bundle.crt;

ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
```

### Security Headers
```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
```

## Caching Strategies
Implemented different caching strategies for various file types:

### Dynamic Content
- Service Worker:
  ```nginx
  location = /serviceworker.js {
      add_header Cache-Control "no-cache, no-store, must-revalidate";
      expires 0;
  }
  ```
- JSON Files:
  ```nginx
  location ~ \.json$ {
      add_header Cache-Control "no-cache, must-revalidate";
      expires 0;
  }
  ```

### Static Content
- Images and SVGs:
  ```nginx
  location /img/ {
      add_header Cache-Control "public, max-age=31536000, immutable";
      expires 365d;
  }
  ```
- JavaScript and CSS:
  ```nginx
  location ~* \.(js|css)$ {
      add_header Cache-Control "public, max-age=86400, must-revalidate";
      expires 1d;
  }
  ```

### PWA Specific
- Manifest:
  ```nginx
  location = /manifest.json {
      add_header Cache-Control "public, max-age=3600";
      expires 1h;
  }
  ```

## Performance Optimizations
1. HTTP/2 enabled
2. GZIP compression:
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   gzip_min_length 1000;
   ```

## Testing and Verification
1. SSL Configuration Test:
   ```bash
   sudo nginx -t
   ```

2. Certificate Verification:
   ```bash
   openssl x509 -in /etc/nginx/ssl/certificate.crt -text -noout
   ```

3. Key Match Verification:
   ```bash
   openssl rsa -in /etc/nginx/ssl/private.key -check
   ```

## Maintenance
- Certificate valid for 90 days
- Set up automatic renewal through ZeroSSL
- Monitor certificate expiration
- Regular security updates

## Security Considerations
1. TLS 1.2 and 1.3 only (older versions disabled)
2. Strong cipher suite configuration
3. HTTP automatically redirects to HTTPS
4. Secure headers implemented
5. Private key permissions restricted to nginx user

## Additional Information
The complete configuration can be found in:
- `/etc/nginx/conf.d/pwa.conf`
- Certificates in `/etc/nginx/ssl/`