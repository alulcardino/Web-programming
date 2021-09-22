package net.omsu.labone;

import net.omsu.labone.Connection;

import java.io.*;
import java.net.MalformedURLException;
import java.net.Socket;
import java.net.URL;

public class SocketType extends Connection {

    public SocketType(String url, String filePath) {
        super(url, filePath);
    }

    @Override
    public void connect() {
        try {
            URL url = new URL(this.getUrl());
            int httpPort = 80;
            String hostName = url.getHost();
            String path = url.getPath();
            path = path.isEmpty() ? "/" : path;

            try (Socket socket = new Socket(hostName, httpPort);
                 BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                 BufferedWriter requestWriter = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
                 OutputStream fileOutputStream = new FileOutputStream(new File(getFile()));
                 BufferedWriter fileWriter = new BufferedWriter(new OutputStreamWriter(fileOutputStream));) {

                requestWriter.write("GET " + path + " HTTP/1.1");
                requestWriter.newLine();
                requestWriter.write("Host: " + hostName);
                requestWriter.newLine();
                requestWriter.write("Connection: Close");
                requestWriter.newLine();
                requestWriter.newLine();
                requestWriter.flush();
                String line = bufferedReader.readLine();
                while (line != null && !line.isEmpty()) {
                    System.out.println(line);
                    line = bufferedReader.readLine();
                }
                while ((line = bufferedReader.readLine()) != null) {
                    fileWriter.write(line);
                    fileWriter.newLine();
                }
            }
        } catch (MalformedURLException e) {
            System.out.println("URL is malformed: " + e.getMessage());
        } catch (IOException e) {
            System.out.println("There are problems with files" + e.getMessage());
        }
    }
}