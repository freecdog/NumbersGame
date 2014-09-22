/**
 * Created by jaric on 22.09.2014.
 */

TestLocalizationCoverage = TestCase("TestLocalizationCoverage");

TestLocalizationCoverage.prototype.testLocalizationCoverage = function() {
    //Localization.runTestOfCoverage();

    var ethalon;
    for (var ei = 0; ei < Localization.loadedPacks.length; ei++) {
        if (Localization.loadedPacks[ei].name == Localization.defaultLanguage()) {
            ethalon = Localization.loadedPacks[ei];
            break;
        }
    }

    var recurStopper = 100000; // to prevent infinite recursion
    // compare recursively ethalon object with other
    function compareElements(level, obj1, obj2, parent1, parent2){
        if (recurStopper-- < 0) return;

        if (parent1 == null) parent1 = obj1;
        if (parent2 == null) parent2 = obj2;

        var objType = typeof(obj1);
        if (objType == 'string'){
            //assertEquals(objType, typeof(obj2));
        } else if (objType == 'object'){
            for (var element in obj1) {
                if (obj1.hasOwnProperty(element)){
                    if (obj2.hasOwnProperty(element)){
                        if (typeof(obj1[element]) == 'object') {
                            compareElements(level+1, obj1[element], obj2[element], parent1, parent2);
                        }
                    } else {
                        //assertEquals(typeof(obj1), typeof(obj2));
                        console.warn(parent2.name, 'does not have param:', element, ', priority:', level+1);
                    }
                }
            }
            if (Object.keys(obj2).length > Object.keys(obj1).length) {
                for (var extraElement in obj2) {
                    if (obj2.hasOwnProperty(extraElement) && obj1.hasOwnProperty(extraElement) == false) {
                        console.warn(parent2.name, 'has extra param:', extraElement);
                    }
                }
            }
        } else {
            console.error('different type ', obj1, obj2, level);
        }
    }

    for (var i = 0; i < Localization.loadedPacks.length; i++){
        var pack = Localization.loadedPacks[i];
        var name = pack.name;
        if (ethalon.name == name) continue;
        //console.log('going to compare with', name);
        compareElements(0, ethalon, pack);
    }
};