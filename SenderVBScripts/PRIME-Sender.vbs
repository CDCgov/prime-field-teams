Const adTypeBinary = 1
Const adSaveCreateOverWrite = 2

Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run "powershell -executionpolicy bypass -file c:\temp\balloontip.ps1" , 0
Set WshShell = Nothing

Dim BinaryStream
Set BinaryStream = CreateObject("ADODB.Stream")

yr = CStr(Year(Now))
mo = CStr(Month(Now))  
dy = CStr(Day(Now))

Set objFSO = CreateObject("Scripting.FileSystemObject")

objStartFolder = Wscript.Arguments(0)
Set objFolder = objFSO.GetFolder(objStartFolder)
targetFolder = objStartFolder & "\Processed\"

rem msgbox( Wscript.Arguments(0) & " -- " & Wscript.Arguments(1) & " -- " & WScript.Arguments(2) & " -- " & Wscript.Arguments(3) )
rem wscript.quit

Set colFiles = objFolder.Files
For Each objFile in colFiles
	fileType = objFSO.GetExtensionName(objStartFolder & objFile.Name)
	fileBase = objFSO.GetBaseName(objStartFolder & objFile.Name)
	if fileType="csv" then 
		csv = readCSV(objStartFolder & objFile.Name)
		resp = CallAPI(csv)
		responseFileName = targetFolder & fileBase & ".rep"
		responseFileNameTxt = targetFolder & fileBase & ".txt"
		resp2 = jsonToReport(resp)
		ret = writeResponse(resp, responseFileName)
		ret = writeResponse(resp2, responseFileNameTxt)
	end if
	objFSO.MoveFile objStartFolder & objFile.Name, targetFolder
Next


Wscript.Quit 

Function ParseJson(strJson)
  Set html = CreateObject("htmlfile")
  Set window = html.parentWindow
  window.execScript "var json = " & strJson, "JScript"
  Set ParseJson = window.json
End Function

Function jsonToReport(strJson)
	Set oJSON=ParseJson(strJson)
	cnt = oJSON.errorCount
	txtReport = "Report for : " & responseFileName & vbCrLf
	txtReport = txtReport & vbCrLf & "Errors: " & cnt & vbCrLf
	txtReport = txtReport & "--------------------------------------------------------------" & vbCrLf
	arr = Split(strJson,",")
	i=0
	For each Item in arr
		
		arr2 = Split(Item,":")
		arr_property =  Replace(arr2(0),chr(34),"")
		arr_value =  Replace(Replace(Replace(Replace(arr2(1),chr(34),""),"}",""),"{",""),"]","")
		if InStr(arr_property,"details") then 
			i=i+1
			txtReport = txtReport & "Error (" & i & "): " & arr_value 
		end if 
		if i= cnt then 
			 Exit For 
		end if  
	Next
	cnt = oJSON.warningCount
	txtReport = txtReport & vbCrLf & "Warnings: " & cnt & vbCrLf
	txtReport = txtReport & "--------------------------------------------------------------" & vbCrLf
	i=0
	j=0
	skiptoerror=False
	For each Item in arr
		j=j+1
		
		arr2 = Split(Item,":")
		arr_property =  Replace(arr2(0),chr(34),"")
		arr_value =  Replace(Replace(Replace(Replace(arr2(1),chr(34),""),"}",""),"{",""),"]","")
		if InStr(arr_property,"warnings") then 
			skiptoerror=True
		end if 


		if skiptoerror And InStr(arr_property,"details") then 
			i=i+1
			txtReport = txtReport & "Warning (" & i & "): " & arr_value 
		end if 
		if i= cnt then 
			 Exit For 
		end if  
	Next
	jsonToReport = txtReport
End Function


Function writeResponse(resp, fileName)
	Set fso = CreateObject("Scripting.FileSystemObject")
	Set outputFile = fso.CreateTextFile(fileName, True)
	outputFile.Write resp
	outputFile.Close
	writeResponse="OK"
End Function

Function readCSV(FileName)
	Set fso = CreateObject("Scripting.FileSystemObject")
	Set inputFile = fso.OpenTextFile(FileName, 1)
	csv = ""
	Do While inputFile.AtEndOfStream <> True
		csv = csv + inputFile.ReadLine & vbCrLf
		Loop
	readCSV = csv
End Function

Function CallAPI(Payload)
    Set oXMLHTTP = CreateObject("Microsoft.XmLHttp") ' create my request object
    Set oXMLDoc = CreateObject("MSXML2.DOMDocument") ' create my response object

	url = Wscript.Arguments(1)
    call oXMLHTTP.open("POST", url, false)
	call oXMLHTTP.setrequestheader("content-type","text/csv")
	call oXMLHTTP.setrequestheader("x-functions-key",Wscript.Arguments(3))
	call oXMLHTTP.setrequestheader("client",Wscript.Arguments(2))
    call oXMLHTTP.send(Payload)
	CallAPI = oXMLHTTP.responseText
End Function
