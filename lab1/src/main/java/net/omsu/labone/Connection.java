package net.omsu.labone;

import java.net.MalformedURLException;

public abstract class Connection {
    private String url;
    private String file;

    public Connection(String url, String file) {
        this.url = url;
        this.file = file;
    }

    public String getUrl() {
        return url;
    }

    public String getFile() {
        return file;
    }

    public abstract void connect() ;
}
