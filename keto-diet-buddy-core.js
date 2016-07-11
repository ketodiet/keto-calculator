/**
 * Created by ketodiet on 03/07/2016.
 *
 * More information & a working example can be found at http://ketodietapp.com/Blog/page/KetoDiet-Buddy
 *
 */

var Gender = {
    FEMALE: 0,
    MALE: 1
};

var Warnings = {
    //
    // Essential bodyfat is too low
    //
    LOW_BODYFAT: (1<<0),

    //
    // Fat intake (in grams) required to meet desirable level is too low (less then 30g)
    //
    LOW_FATGRAMS: (1<<1),

    //
    // Calories required to meet desirable level are way too low (less than 1200 kcal)
    //
    LOW_CALORIES: (1<<2),

    //
    // Net Carbs limit set too high making it impossible to meet desirable targets
    //
    HIGH_CARBS: (1<<3)
};

class KetoDietBuddy {

    //
    // Construct the KetoDietBuddy calculator
    //
    // params *must* include:
    //    gender (see Gender)
    //    age (in years, can be float)
    //    weight (in kilos)
    //    height (in cm)
    //    activityLevel (0 - 1, float)
    //    bodyFat (0 - 100, percentage)
    //    netCarbs (net carbs limit in grams)
    //
    // see index.jsx for an example on how to use this class
    //
    constructor(params) {

        function getSafe(value, min, max) {
            return Math.min(Math.max(min, value), max);
        }

        //
        // Enforce some sensible ranges
        //
        this.gender = params.gender;
        this.age = getSafe(params.age, 0, 150);
        this.weight = getSafe(params.weight, 0, 350);
        this.height = getSafe(params.height, 0, 250);
        this.activityLevel = getSafe(params.activityLevel, 0, 1);
        this.bodyfat = getSafe(params.bodyfat, 0, 100);
        this.netCarbs = getSafe(params.netCarbs, 0, 1000);

        //
        // calculate Basal BMR, see http://ketodietapp.com/Blog/page/KetoDiet-Buddy for more info
        //
        switch (this.gender){
            default:
            case Gender.FEMALE:
                //
                // female: 9.99 x weight (kg) + 6.25 x height (cm) - 4.92 x age (y) - 161
                //
                this.bmr = (9.99 * this.weight) + (6.25 * this.height) - (4.92 * this.age) - 161;
                break;
            case Gender.MALE:
                //
                // male:    9.99 x weight (kg) + 6.25 x height (cm) - 4.92 x age (y) + 5
                //
                this.bmr = (9.99 * this.weight) + (6.25 * this.height) - (4.92 * this.age) + 5;
                break;
        }

        //
        // Calculate Protein Level for given activity level
        //
        var activityProteinMin = 1.3;
        var activityProteinMax = 2.2;
        var activityProteinFactor = activityProteinMin + ((activityProteinMax - activityProteinMin) * this.activityLevel);
        var leanMass = ((100 - this.bodyfat) * this.weight) / 100;
        this.longTermProteinIntake = leanMass * activityProteinFactor;

        //
        // Calculate calorie intake for maintenance level
        // Note: Using polynomial curve fitting function
        //
        var  activityBmrFactor =  1.0999999999999945e+000
                               + (-2.3333333333231288e-001 * this.activityLevel)
                               + (3.7999999999943399e+000 * Math.pow(this.activityLevel, 2))
                               + (-5.8666666666573466e+000 * Math.pow(this.activityLevel, 3))
                               + (3.1999999999953190e+000 * Math.pow(this.activityLevel, 4));

        this.maintenanceCalorieIntake = this.bmr * activityBmrFactor * 1.1;

        //
        // Calculate essential and non-essential bodyfat
        //
        switch (this.gender){
            default:
            case Gender.FEMALE:
                //
                // Source: wikipedia: 8% - 12%
                //
                this.essentialBodyFat = 8;
                break;
            case Gender.MALE:
                //
                // wikipedia: 3% - 5%
                //
                this.essentialBodyFat = 3;
                break;
        }

        this.nonEssentialBodyFat = this.bodyfat - this.essentialBodyFat;
        if (this.nonEssentialBodyFat < 0) {
            this.nonEssentialBodyFat = 0;
            this.bodyFatTooLow = true;
        } else {
            this.bodyFatTooLow = false;
        }

        return this;
    }

    //
    // Helper functions
    //


    //
    // Calculate calories based on fat, protein & carbs
    //
    static calculateCalorieIntakeFromMacronutrients(fatGrams, proteinInGrams, netCarbsInGrams) {
        return (fatGrams * 9) + (proteinInGrams * 4) + (netCarbsInGrams * 4);
    }

    //
    // Calculate fat intake in grams to meet calorie requirements for a given protein and carbs intake
    //
    static calculateFatIntakeInGrams(calorieIntake, proteinInGrams, netCarbsInGrams) {
        var proteinKCals = proteinInGrams * 4;
        var carbsKCals = netCarbsInGrams * 4;
        var fatKCals = calorieIntake - (proteinKCals + carbsKCals);
        var fatGrams = fatKCals / 9;
        return fatGrams;
    }

    //
    // Calculate macronutrient ratios in grams, calories and percentages based on fat, protein & carbs
    //
    static calculateMacronutrientRatio(fatGrams, proteinGrams, netCarbGrams) {

        function roundMacroGrams(floatValue) {
            return parseFloat(floatValue.toFixed(1));
        }

        function roundMacroPerc(floatValue) {
            return parseFloat(floatValue.toFixed(0));
        }

        function roundMacroEnergy(floatValue) {
            return parseFloat(floatValue.toFixed(0));
        }

        var kcalFat = fatGrams * 9;
        var kcalProtein = proteinGrams * 4;
        var kcalNetCarbs = netCarbGrams * 4;
        var kcalTotal = kcalNetCarbs + kcalProtein + kcalFat;

        if (kcalTotal <= 0) {
            return;
        }

        var result = {};
        result.energy = roundMacroEnergy(kcalTotal);
        result.gramsFat = roundMacroGrams(fatGrams);
        result.gramsProtein = roundMacroGrams(proteinGrams);
        result.gramsNetCarbs = roundMacroGrams(netCarbGrams);
        result.energyFat = roundMacroEnergy(kcalFat);
        result.energyProtein = roundMacroEnergy(kcalProtein);
        result.energyNetCarbs = roundMacroEnergy(kcalNetCarbs);
        result.percEnergyNetCarbs = roundMacroPerc((100 * kcalNetCarbs) / kcalTotal);
        result.percEnergyProtein = roundMacroPerc((100 * kcalProtein) / kcalTotal);
        result.percEnergyFat = roundMacroPerc(100 - (result.percEnergyNetCarbs + result.percEnergyProtein));
        return result;
    }

    //
    // Core functions
    //

    //
    // The main KetoDietBuddy function: calculate macronutrient ratios for maintenance, minimum & desirable
    // levels. The adjustment factor determines the desirable calorie deficit or surplus. A positive value of 5
    // will result in 5% calorie surplus for weight/ muscle gain where a negative -5% will result in a 5% calorie
    // deficit for weight/ fat loss.
    //
    // The resulting data is a collection of macronutrient ratios as calculated by calculateMacronutrientRatio.
    //
    calculateCalorieIntake(adjustment) {

        var result = {};
        result.adjustment = adjustment;
        result.warnings = 0;

        if (this.bodyFatTooLow) {
            result.warnings |= Warnings.LOW_BODYFAT;
        }
        else if (minimumFoodIntake >= this.maintenanceCalorieIntake) {
            result.warnings |= Warnings.HIGH_CARBS;
        }

        var nonEssentialFatMass = ((this.bodyfat - this.essentialBodyFat) * this.weight) / 100;
        var maxFatInGrams = KetoDietBuddy.calculateFatIntakeInGrams(this.maintenanceCalorieIntake, this.longTermProteinIntake, this.netCarbs);
        if (maxFatInGrams < 0) {
            maxFatInGrams = 0;
            result.warnings |= Warnings.HIGH_CARBS;
        }

        var minimumFoodIntake = this.maintenanceCalorieIntake - (69.2 * Math.max(0, nonEssentialFatMass));
        var minFatInGrams = KetoDietBuddy.calculateFatIntakeInGrams(minimumFoodIntake, this.longTermProteinIntake, this.netCarbs);
        if (minFatInGrams < 30) {
            minFatInGrams = 30;
            minimumFoodIntake = KetoDietBuddy.calculateCalorieIntakeFromMacronutrients(minFatInGrams, this.longTermProteinIntake, this.netCarbs);
        }

        var desirableFoodIntake = this.maintenanceCalorieIntake + ((adjustment * this.maintenanceCalorieIntake) / 100);
        var desirableFatInGrams = KetoDietBuddy.calculateFatIntakeInGrams(desirableFoodIntake, this.longTermProteinIntake, this.netCarbs);
        if (desirableFatInGrams < 0) {
            desirableFatInGrams = 0;
            result.warnings |= Warnings.HIGH_CARBS;
        }

        result.maintenance = KetoDietBuddy.calculateMacronutrientRatio(maxFatInGrams, this.longTermProteinIntake, this.netCarbs);
        result.minimum = KetoDietBuddy.calculateMacronutrientRatio(minFatInGrams, this.longTermProteinIntake, this.netCarbs);
        result.desirable = KetoDietBuddy.calculateMacronutrientRatio(desirableFatInGrams, this.longTermProteinIntake, this.netCarbs);

        if (result.desirable.gramsFat < 30) {
            result.warnings |= Warnings.LOW_FATGRAMS;
        }
        if (desirableFoodIntake < 1200) {
            result.warnings |= Warnings.LOW_CALORIES;
        }

        return result;
    }
}

//
// Exports
//

module.exports = {
    KetoDietBuddy: KetoDietBuddy,
    Gender: Gender,
    Warnings: Warnings
};
