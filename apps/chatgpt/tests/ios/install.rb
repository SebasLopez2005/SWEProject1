require 'xcodeproj'
require 'fileutils'

project_path = 'ios/FitnessWorkoutLog.xcodeproj'
project = Xcodeproj::Project.open(project_path)
app = project.targets.find { |target| target.name == 'FitnessWorkoutLog' }
ui_tests = project.targets.find { |target| target.name == 'WorkoutLogUITests' }
unless ui_tests
  ui_tests = project.new_target(:ui_test_bundle, 'WorkoutLogUITests', :ios, app.deployment_target)
  ui_tests.add_dependency(app)
  source = project.main_group.new_file('../tests/ios/WorkoutLogUITests.swift')
  ui_tests.add_file_references([source])
end
ui_tests.build_configurations.each do |config|
    config.build_settings.merge!(
      'PRODUCT_BUNDLE_IDENTIFIER' => 'edu.cs3365.fitnessworkoutlog.uitests',
      'TEST_TARGET_NAME' => app.name, 'SWIFT_VERSION' => '5.0',
      'GENERATE_INFOPLIST_FILE' => 'YES', 'PRODUCT_NAME' => '$(TARGET_NAME)',
      'CODE_SIGNING_ALLOWED' => 'NO'
    )
  end
project.root_object.attributes['TargetAttributes'] ||= {}
project.root_object.attributes['TargetAttributes'][ui_tests.uuid] = { 'TestTargetID' => app.uuid }
project.save
scheme = Xcodeproj::XCScheme.new
scheme.add_build_target(app)
scheme.add_test_target(ui_tests)
scheme.set_launch_target(app)
scheme.save_as(project_path, 'WorkoutLogUITests', true)
