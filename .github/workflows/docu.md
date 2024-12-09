## Documentation Test automation

1. Ziel
   Das Ziel war, eine automatisierte Test-Pipeline mit GitHub Actions einzurichten, um Tests bei jeder Codeänderung automatisch auszuführen. Erst sind die Pipeline mit Mockup-Tests validiert, während auf die echten Tests gewartet wird.

2. ### Verwendete Technologien
   - GitHub Actions: Zur Automatisierung von Testprozessen bei Codeänderungen (z. B. Pushes oder Pull Requests).
   - Jest: Eine JavaScript-Testbibliothek für Unit-Tests und Coverage-Reports.
   - npm ci: Für eine konsistente und schnelle Installation der Abhängigkeiten.
   - Mockup-Tests: Temporäre Tests, die einfache Funktionen validieren, bis die echten Tests verfügbar sind.
3. ### Durchgeführte Arbeiten
   GitHub Actions Workflow:
   - Ein YAML-Workflow wurde erstellt, um die Tests automatisch bei Änderungen im Branch auszuführen.
   - Mockup-Tests: Ein einfacher Test wurde hinzugefügt, um die Pipeline zu validieren.
   - Jest-Konfiguration: Jest wurde als Test-Framework integriert und für automatisierte Tests vorbereitet.
   - Fehlerbehebung: Berechtigungen für Jest korrigiert, um die Tests erfolgreich auszuführen.
4. ### Vorteile der Konfiguration

   Automatisierung:

   - Tests werden bei jedem Push oder Pull Request automatisch ausgeführt.

   Konsistenz:

   - Die Verwendung von npm ci stellt sicher, dass alle Abhängigkeiten konsistent installiert werden.

   Flexibilität:

   - Mockup-Tests ermöglichen eine schnelle Validierung der Pipeline, ohne auf echte Tests warten zu müssen.

   Erweiterbarkeit:

   - Die Konfiguration ist bereit, um echte Tests zu integrieren, sobald sie verfügbar sind.

5. ### Nächste Schritte
   Integration der echten Tests, sobald sie bereitgestellt werden.
   Eventuelle Optimierungen der Pipeline, falls notwendig.
   Erweiterung der Tests auf weitere Branches oder Node.js-Versionen.
