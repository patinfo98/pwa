provider "aws" {
  region = "eu-central-1"
}

resource "aws_instance" "web_server" {
  ami           = "ami-0b5673b5f6e8f7fa7"
  instance_type = "t2.micro"

  key_name      = "Polly-PWA"
  security_groups = ["allow_ssh_http"]

  user_data = <<-EOF
              #!/bin/bash

              # System vollständig aktualisieren
              yum update -y

              # Node.js und NPM installieren (falls noch nicht vorhanden)
              curl -sL https://rpm.nodesource.com/setup_16.x | bash -
              yum install -y nodejs

              # Git installieren
              yum install -y git

              # Nginx installieren
              yum install -y nginx

              # App-Ordner erstellen und Anwendung klonen
              mkdir -p /home/ec2-user/pwa
              cd /home/ec2-user/pwa

              # Anwendung von GitHub klonen
              git clone https://github.com/<username>/<repository>.git .

              # Abhängigkeiten installieren
              npm install

              # Build-Prozess der Anwendung
              npm run build

              # Nginx starten und konfigurieren
              service nginx start

              # Nginx so konfigurieren, dass die Anwendung bedient wird
              cp /home/ec2-user/app/nginx.conf /etc/nginx/nginx.conf
              EOF
}

resource "aws_security_group" "allow_ssh_http" {
  name        = "allow_ssh_http"
  description = "Erlaubt SSH und HTTP Zugriff"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH-Zugriff von überall
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # HTTP-Zugriff von überall
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}