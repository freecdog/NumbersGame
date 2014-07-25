/**
 * Created by jaric on 24.07.2014.
 */
TestCombinations = TestCase("TestCombinations");

TestCombinations.prototype.testGreet = function() {
    //console.log("I was here too");
    assertEquals("Hello World!", "Hello " + "World!");
};

TestCombinations.prototype.testCheckCombinations = function() {
    //console.log(NumbersBase.checkCombinations("134256"));
    var tests = [
        {
            dice: "134256",
            combinations: [1,2,3,4,5,6, 0,0,0,30,40,0,21]
        },
        {
            dice: "111111",
            combinations: [6,0,0,0,0,0, 6,6,0,0,0,50,6]
        },
        {
            dice: "222222",
            combinations: [0,12,0,0,0,0, 12,12,0,0,0,50,12]
        },
        {
            dice: "222233",
            combinations: [0,8,6,0,0,0, 14,14,25,0,0,0,14]
        },
        {
            dice: "123666",
            combinations: [1,2,3,0,0,18, 24,0,0,0,0,0,24]
        },
        {
            dice: "452233",
            combinations: [0,4,6,4,5,0, 0,0,0,30,0,0,19]
        }
    ];
    for (var i = 0; i < tests.length; i++) {
        assertEquals(tests[i].combinations, NumbersBase.checkCombinations(tests[i].dice));
    }
};