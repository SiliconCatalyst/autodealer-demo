[Setup]
AppId={{6BDCD866-C5A9-4C4B-8783-A12945596F38}}
AppName=Diplome Filler
AppVersion=1.0.0
AppPublisher=Boulellou Abdulmalek
AppUpdatesURL=https://github.com/SiliconCatalyst/df-updates/releases
DefaultDirName={commonpf64}\Diplome Filler
DefaultGroupName=Diplome Filler
UninstallDisplayName=Diplome Filler
OutputDir=C:\Users\pc\Documents\Code
OutputBaseFilename=df-setup-amd64-v1.0.0
LicenseFile=ToS.txt
WizardStyle=modern
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=admin
SetupIconFile=setup.ico
; Support both 32-bit and 64-bit Windows
ArchitecturesAllowed=x64compatible
CloseApplications=yes
RestartApplications=yes
DisableProgramGroupPage=yes
VersionInfoVersion=1.0.0
VersionInfoCompany=Boulellou Abdulmalek
VersionInfoCopyright=Copyright © 2025 Boulellou Abdulmalek
VersionInfoProductName=Diplome Filler
VersionInfoProductVersion=1.0.0
VersionInfoDescription=Diplome Filler Installation

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
; Main executable
Source: "dist\Diplome Filler.exe"; DestDir: "{app}"; Flags: ignoreversion

; Embedded Python folder and contents
Source: "resources\python-3.8.10-embed-amd64\*"; DestDir: "{app}\python"; Flags: ignoreversion recursesubdirs createallsubdirs

; Icon file
Source: "app.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "setup.ico"; DestDir: "{app}"; Flags: ignoreversion

; Documentation
Source: "LICENSE.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "ToS.txt"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\Diplome Filler"; Filename: "{app}\Diplome Filler.exe"; IconFilename: "{app}\app.ico"
Name: "{commondesktop}\Diplome Filler"; Filename: "{app}\Diplome Filler.exe"; IconFilename: "{app}\app.ico"