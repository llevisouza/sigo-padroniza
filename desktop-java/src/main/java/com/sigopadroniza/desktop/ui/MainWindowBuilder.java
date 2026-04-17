package com.sigopadroniza.desktop.ui;

import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;

/**
 * Fabrica da janela principal para desacoplar a inicialização da aplicação da composição visual.
 */
public final class MainWindowBuilder {

    private MainWindowBuilder() {
        // utilitário estático
    }

    public static Scene build(int width, int height) {
        BorderPane root = new BorderPane();
        root.setPadding(new Insets(16));

        Label title = new Label("SIGO Padroniza Desktop JavaFX");
        title.getStyleClass().add("app-title");

        Label subtitle = new Label("Scaffold inicial pronto para migração do núcleo de domínio");
        subtitle.getStyleClass().add("app-subtitle");

        VBox header = new VBox(8, title, subtitle);
        root.setTop(header);

        return new Scene(root, width, height);
    }
}
