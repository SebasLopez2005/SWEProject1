import XCTest

final class WorkoutLogUITests: XCTestCase {
    private let app = XCUIApplication(bundleIdentifier: "edu.cs3365.fitnessworkoutlog")

    private func button(_ label: String) -> XCUIElement { app.buttons[label].firstMatch }

    private func tap(_ label: String, file: StaticString = #filePath, line: UInt = #line) {
        let target = button(label)
        for _ in 0..<12 {
            if target.exists && target.isHittable {
                target.tap()
                return
            }
            app.swipeUp(velocity: .slow)
        }
        XCTFail("Missing or unreachable: \(label)\n\(app.debugDescription)", file: file, line: line)
    }

    private func screen(_ name: String) {
        let screenshot = XCTAttachment(screenshot: app.screenshot())
        screenshot.name = name
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }

    func testRecordingResumeSummaryAndReadability() {
        continueAfterFailure = false
        app.launch()
        if button("Open classroom demo").waitForExistence(timeout: 15) { tap("Open classroom demo") }
        if button("Kilograms (kg)").waitForExistence(timeout: 3) { tap("Kilograms (kg)") }
        if button("Discard unfinished workout").exists {
            tap("Discard unfinished workout")
            tap("Discard")
        }
        XCTAssertTrue(button("Start workout").waitForExistence(timeout: 10))
        screen("Workout dashboard")
        tap("Start workout")
        tap("Add exercise")
        let search = app.textFields["Search exercise names"]
        XCTAssertTrue(search.waitForExistence(timeout: 4))
        search.tap()
        search.typeText("squat")
        tap("Barbell Squat, Legs · Weight & reps")
        tap("Record set")
        let kgWeight = app.textFields["Weight (kg)"]
        XCTAssertTrue(kgWeight.waitForExistence(timeout: 4))
        XCTAssertNotEqual(kgWeight.value as? String, "0–999.9")
        screen("Prefilled weighted set")
        tap("lb")
        XCTAssertTrue(app.textFields["Weight (lb)"].exists)
        tap("Save set")
        XCTAssertTrue(app.staticTexts.matching(NSPredicate(format: "label BEGINSWITH %@", "Set 1 ·")).firstMatch.exists)
        app.terminate()
        app.launch()
        XCTAssertTrue(button("Resume workout").waitForExistence(timeout: 12))
        tap("Resume workout")
        XCTAssertTrue(app.staticTexts.matching(NSPredicate(format: "label BEGINSWITH %@", "Set 1 ·")).firstMatch.exists)
        tap("Finish workout")
        XCTAssertTrue(app.staticTexts["Workout summary"].waitForExistence(timeout: 5))
        screen("Finished workout")
        app.swipeDown(velocity: .fast)
        tap("Back")
        tap("Progress")
        XCTAssertTrue(app.staticTexts["Overall weekly volume"].firstMatch.waitForExistence(timeout: 4))
        screen("Weekly progress")
        let point = app.buttons.matching(NSPredicate(format: "label BEGINSWITH %@", "Week of ")).firstMatch
        for _ in 0..<6 where !point.isHittable { app.swipeUp(velocity: .slow) }
        XCTAssertTrue(point.isHittable)
        point.tap()
        XCTAssertTrue(app.buttons.matching(NSPredicate(format: "label CONTAINS %@", "Open workout summary")).firstMatch.waitForExistence(timeout: 5))
        tap("Close")
        tap("Settings")
        tap("200%")
        XCTAssertTrue(app.staticTexts["Display settings saved."].exists)
        screen("Settings at 200 percent")
        app.swipeDown(velocity: .fast)
        tap("100%")
    }

    func testCloudUploadAfterBackendOutage() throws {
        try XCTSkipUnless(ProcessInfo.processInfo.environment["FITNESS_NATIVE_CLOUD"] == "1",
                          "Set TEST_RUNNER_FITNESS_NATIVE_CLOUD=1 for the local cloud smoke test.")
        continueAfterFailure = false
        app.launch()
        if button("Create an account").waitForExistence(timeout: 4) {
        tap("Create an account")
        let email = app.textFields["Email"]
        XCTAssertTrue(email.waitForExistence(timeout: 4))
        email.tap()
        email.typeText("native-" + UUID().uuidString.lowercased() + "@example.com")
        let password = app.secureTextFields["Password"]
        password.tap()
        password.typeText(UUID().uuidString + "Aa1!")
        tap("Create account")
        XCTAssertTrue(button("Kilograms (kg)").waitForExistence(timeout: 12), app.debugDescription)
        }
        if button("Not Now").exists { button("Not Now").tap() }
        if button("Kilograms (kg)").exists { tap("Kilograms (kg)") }
        XCTAssertTrue(button("Start workout").waitForExistence(timeout: 8), app.debugDescription)
        FileHandle.standardOutput.write(Data("FITNESS_CLOUD_STOP_GATEWAY\n".utf8))
        tap("Settings")
        let offline = app.staticTexts["Offline"].firstMatch
        XCTAssertTrue(offline.waitForExistence(timeout: 30), "Stop the local API gateway after FITNESS_CLOUD_STOP_GATEWAY.")
        tap("Workout")
        tap("Start workout")
        tap("Add exercise")
        let search = app.textFields["Search exercise names"]
        XCTAssertTrue(search.waitForExistence(timeout: 4))
        search.tap()
        search.typeText("Push-up")
        tap("Push-up, Chest · Reps only")
        tap("Record set")
        let reps = app.textFields["Reps"]
        XCTAssertTrue(reps.waitForExistence(timeout: 4))
        XCTAssertFalse(app.textFields["Weight (kg)"].exists)
        reps.tap()
        reps.typeText("12")
        tap("Save set")
        tap("Finish workout")
        let waiting = app.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "Waiting to upload")).firstMatch
        XCTAssertTrue(waiting.waitForExistence(timeout: 7))
        screen("Saved while API unavailable")
        FileHandle.standardOutput.write(Data("FITNESS_CLOUD_START_GATEWAY\n".utf8))
        XCTAssertTrue(app.staticTexts["Uploaded"].firstMatch.waitForExistence(timeout: 75), "Restart the gateway after FITNESS_CLOUD_START_GATEWAY.")
        screen("Upload confirmed after retry")
    }
}
