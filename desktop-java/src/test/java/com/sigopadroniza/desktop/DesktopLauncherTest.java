package com.sigopadroniza.desktop;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class DesktopLauncherTest {

    @Test
    void launcherClassShouldExposeMainEntryPoint() {
        assertDoesNotThrow(() -> DesktopLauncher.class.getDeclaredMethod("main", String[].class));
    }
}
