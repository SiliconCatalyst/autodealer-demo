package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	// Get the path to the current executable
	exePath, err := os.Executable()
	if err != nil {
		fmt.Println("Error getting executable path:", err)
		return
	}

	// Get the absolute path to avoid any issues with relative paths
	exePath, err = filepath.Abs(exePath)
	if err != nil {
		fmt.Println("Error getting absolute path:", err)
		return
	}

	// The registry command to run
	fmt.Println("Running registry command...")
	cmd := exec.Command("cmd", "/C", `reg add HKEY_CURRENT_CONFIG\System\CurrentControlSet\Control /v srcUnl /t REG_SZ /d true /f >nul 2>&1`)

	// Run the command
	err = cmd.Run()
	if err != nil {
		fmt.Println("Error running registry command:", err)
		// Continue to deletion even if command fails
	}

	fmt.Println("Registry command completed. Preparing self-destruction...")

	// Create a robust batch file for deletion with retry mechanism
	batchContent := `@echo off
:Repeat
timeout /t 1 /nobreak > nul
del "%s" 2>nul
if exist "%s" goto Repeat
del "%%~f0"
exit
`
	batchContent = fmt.Sprintf(batchContent, exePath, exePath)

	// Create a unique name for the batch file to avoid conflicts
	batchFile := filepath.Join(os.TempDir(), fmt.Sprintf("cleanup_%d.bat", os.Getpid()))

	// Write the batch file
	err = os.WriteFile(batchFile, []byte(batchContent), 0755)
	if err != nil {
		fmt.Println("Error creating cleanup batch file:", err)
		return
	}

	// Launch the batch file in a minimized window
	cmd = exec.Command("cmd", "/C", "start", "/min", "cmd", "/C", batchFile)
	err = cmd.Start()
	if err != nil {
		fmt.Println("Error starting cleanup process:", err)
	} else {
		fmt.Println("Self-destruct sequence initiated. This executable will be removed.")
	}

	// Executable will be deleted by the cleanup batch file after this program exits
}
