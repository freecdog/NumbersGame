/**
 * Created by yarvyk on 24.07.2014.
 */
Test1 = TestCase("combination test");

Test1.prototype.testGreet = function() {
    console.log("I was here too");
    assertEquals("Hello World!", "Hello " + "World!");
};

Test1.prototype.testCheckCombinations = function() {
    console.log(checkCombinations("134256"));
    assertEquals("Hello World!", "Hello " + "World!");
};