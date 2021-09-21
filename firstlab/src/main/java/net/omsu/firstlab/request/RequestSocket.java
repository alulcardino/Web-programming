package net.omsu.firstlab.request;

import java.io.*;
import java.net.Socket;
import java.net.URL;

public class RequestSocket implements IRequest {
    @Override
    public String pull(final URL url, final File outputBody) {
        int port = url.getPort();
        port = port == -1 ? 80 : port;

        try (final Socket socket = new Socket(url.getHost(), port);
             final InputStream is = socket.getInputStream();
             final OutputStream os = new FileOutputStream(outputBody);
             final BufferedReader reader = new BufferedReader(new InputStreamReader(is));
             final BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os))) {

            String path = url.getFile();
            path = path.isEmpty() ? "/" : path;
            socket.getOutputStream().write((
                    "GET " + path + " HTTP/1.1\n" +
                            "Host: " + url.getHost() + ":" + port + "\n" +
                            "User-Agent: " + getUserAgent() + "\n\n"
            ).getBytes());

            int lenght = 0;
            final StringBuilder stringBuilder = new StringBuilder();

            String line = reader.readLine();
            while (line != null && !line.isEmpty()) {
                if (line.toLowerCase().startsWith("content-length"))
                    lenght = Integer.parseInt(line.split(" ")[1]);
                stringBuilder.append(line).append(System.lineSeparator());
                line = reader.readLine();
            }
            while (lenght > 0) {
                writer.write(reader.read());
                --lenght;
            }
            return stringBuilder.toString();
        } catch (final IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
