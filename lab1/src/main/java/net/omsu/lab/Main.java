package net.omsu.lab;

import picocli.CommandLine;
import java.io.IOException;

public class Main {
    public static void main(final String[] args) throws IOException {
        System.exit(new CommandLine(new BaseCommands())
                .setCaseInsensitiveEnumValuesAllowed(true)
                .execute(args));
    }
}
