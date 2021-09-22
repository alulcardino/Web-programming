package net.omsu.labone;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Map;

public class URLType extends Connection {

    public URLType(String url, String filePath){
        super(url, filePath);
    }

    @Override
    public void connect() {
        try{
            URL url = new URL(this.getUrl());
            URLConnection urlCon = url.openConnection();
            Map<String, List<String>> map = urlCon.getHeaderFields();
            for (String key : map.keySet()) {
                System.out.println(key + ":");
                List<String> values = map.get(key);
                for (String aValue : values) {
                    System.out.println("\t" + aValue);
                }
            }
            InputStream inputStream = urlCon.getInputStream();
            BufferedInputStream bufferedInputStream = new BufferedInputStream(inputStream);
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(this.getFile()));
            byte[] buffer = new byte[4096];
            int bytesRead = -1;
            while ((bytesRead = bufferedInputStream.read(buffer)) != -1) {
                bufferedOutputStream.write(buffer, 0, bytesRead);
            }
            bufferedOutputStream.close();
            bufferedInputStream.close();

        } catch (MalformedURLException e) {
            System.out.println("URL is malformed: " + e.getMessage());
        } catch (IOException e) {
            System.out.println("There are problems with files" + e.getMessage());
        }
    }
}
