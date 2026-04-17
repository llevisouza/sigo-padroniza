package com.sigopadroniza.desktop;

/**
 * Classe de bootstrap para ambientes que exigem ponto de entrada explícito.
 */
public final class DesktopLauncher {

    private DesktopLauncher() {
        // evita instanciação
    }

    public static void main(String[] args) {
        SigoDesktopApp.launchApp(args);
    }
}
