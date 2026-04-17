package com.sigopadroniza.desktop;

import com.sigopadroniza.desktop.ui.MainWindowBuilder;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

/**
 * Aplicação JavaFX principal do SIGO Padroniza Desktop.
 */
public final class SigoDesktopApp extends Application {

    private static final String APP_TITLE = "SIGO Padroniza Desktop";
    private static final int DEFAULT_WIDTH = 1024;
    private static final int DEFAULT_HEIGHT = 680;

    public static void launchApp(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage stage) {
        Scene scene = MainWindowBuilder.build(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        stage.setTitle(APP_TITLE);
        stage.setMinWidth(900);
        stage.setMinHeight(600);
        stage.setScene(scene);
        stage.show();
    }
}
