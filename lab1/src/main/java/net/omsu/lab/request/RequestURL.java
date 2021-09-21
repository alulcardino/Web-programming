package net.omsu.lab.request;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Map;

public class RequestURL implements IRequest {
    @Override
    public String pull(final URL url, final File outputBody) {
        try {
            final URLConnection connection = url.openConnection();
            connection.setRequestProperty("User-Agent", getUserAgent());
            connection.connect();
            try (final InputStream is = connection.getInputStream();
                 final OutputStream os = new FileOutputStream(outputBody);
                 final BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                 final BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    writer.write(line);
                    writer.write(System.lineSeparator());
                }
            }
            final Map<String, List<String>> header = connection.getHeaderFields();
            final StringBuilder builder = new StringBuilder();
            header.get(null).forEach(builder::append);
            builder.append(System.lineSeparator());
            for (final Map.Entry<String, List<String>> entry : header.entrySet())
                if (entry.getKey() != null) {
                    builder.append(entry.getKey()).append(": ");
                    entry.getValue().forEach(builder::append);
                    builder.append(System.lineSeparator());
                }
            return builder.toString();
        } catch (final IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}