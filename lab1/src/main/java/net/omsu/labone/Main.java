package net.omsu.labone;

public class Main {
    public static void main(String[] args) {
        new SocketType("http://lleo.me", "page.html").connect();
        new URLType("http://lleo.me", "page1.html").connect();

    }
}