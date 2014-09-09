/**
 * Created by jaric on 09.09.2014.
 */

TestVanDeGraafCanon = TestCase("TestVanDeGraafCanon");

TestVanDeGraafCanon.prototype.testCheckCalculations = function() {
    //console.log(JSON.stringify(VanDeGraafCanon.vanDeGraafCanon(0,0,1920,1080)));

    var tests = [
        {
            x: 0,
            y: 0,
            w: 640,
            h: 480,
            expectations: [
                {
                    left: 71.1111111111112,
                    top: 53.33333333333336,
                    width: 213.3333333333332,
                    height: 320
                },
                {
                    left: 355.5555555555556,
                    top: 53.33333333333336,
                    width: 213.3333333333332,
                    height: 320
                }
            ]
        },
        {
            x: 100,
            y: 0,
            w: 640,
            h: 480,
            expectations: [
                {
                    left: 171.11111111111097,
                    top: 53.333333333333286,
                    width: 213.3333333333336,
                    height: 320
                },
                {
                    left: 455.55555555555543,
                    top: 53.333333333333286,
                    width: 213.3333333333336,
                    height: 320
                }
            ]
        },
        {
            x: 0,
            y: 0,
            w: 1920,
            h: 1080,
            expectations: [
                {
                    left: 213.33333333333348,
                    top: 120,
                    width: 639.9999999999998,
                    height: 960
                },
                {
                    left: 1066.6666666666667,
                    top: 120,
                    width: 639.9999999999998,
                    height: 960
                }
            ]
        }
    ];
    for (var i = 0; i < tests.length; i++) {
        var test = tests[i];
        var calculatedResults = VanDeGraafCanon.vanDeGraafCanon(test.x,test.y,test.w,test.h);
        for (var j = 0; j < test.expectations.length; j++){
            var expectation = test.expectations[j];
            var calculatedResult = calculatedResults[j];
            for (var param in expectation) {
                assertEquals(expectation[param], calculatedResult[param]);
            }
        }
    }
};