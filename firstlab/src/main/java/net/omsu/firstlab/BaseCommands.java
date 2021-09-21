package net.omsu.firstlab;

import net.omsu.firstlab.request.IRequest;
import net.omsu.firstlab.request.RequestSocket;
import net.omsu.firstlab.request.RequestURL;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;

import java.io.File;
import java.net.URL;

public class BaseCommands implements Runnable {
    @Parameters(description = "URL to page.")
    URL url;
    @Option(required = true, names = "-f" , description = "html file")
    File outputFile;
    @Option(names = "-a" , description = "algorithm")
    Algorithm algorithm = Algorithm.URL_CONNECTION;

    @Override
    public void run() {
        System.out.println(algorithm.requestAlg.pull(url, outputFile));
    }

    enum Algorithm {
        SOCKET(new RequestSocket()),
        URL_CONNECTION(new RequestURL());

        private final IRequest requestAlg;

        Algorithm(final IRequest algorithm) {
            requestAlg = algorithm;
        }
    }
}