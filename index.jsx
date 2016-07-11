/**
 * Created by ketodiet on 03/07/2016.
 *
 * This is a ReactJS test page for the KetoDiet keto-calulator.
 * see keto-diet-buddy-core.js for more info.
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import core from './keto-diet-buddy-core.js';

export class App extends React.Component {

    constructor() {
        super();

        this.state = {
            params: {
                gender: core.Gender.FEMALE,
                age: 35,
                weight: 66,
                bodyfat: 26,
                height: 160,
                activityLevel: 0.5,
                netCarbs: 30
            },
            others: {
                calorieAdjustment: -10
            }
        }
    }

    updateParams(newValue) {
        this.setState({params: newValue});
    }

    updateOthers(newValue) {
        this.setState({others: newValue});
    }

	render() {

        var exampleData = {
            gender: core.Gender.FEMALE,
            age: 35,
            weight: 85,
            bodyfat: 30,
            height: 160,
            activityLevel: 0,
            netCarbs: 30
        };

        var calorieAdjustment = -15;

        var kdb = new core.KetoDietBuddy(exampleData);
        var typicalResult = kdb.calculateCalorieIntake(calorieAdjustment);

		return (
            <div>
                <h1>ReactJS demo for KetoDiet Buddy</h1>
                <p>KetoDiet Buddy is a keto calculator designed to help people determine their ideal food intake (macronutrients) for the ketogenic as well as other types of low-carbs diets.</p>
                <p>You can find out more about it and try a real-world example on the <a target="_blank" href="http://ketodietapp.com/Blog/page/KetoDiet-Buddy">KetoDiet Calculator</a> home page</p>

                <h2>Usage</h2>
                <div>
                    <em>If you use portions of this code on your website or any application please acknowledge the original source by linking to the <a href="https://github.com/ketodiet/keto-calculator">Github project</a> as shown below:</em>
                    <h4>Example</h4>
                    <div className="notice">
                        <span>Based on <a href="https://github.com/ketodiet/keto-calculator">KetoDiet calculator</a></span>
                    </div>
                    <h4>Source HTML</h4>
                    <div className="code">
                        &lt;span&gt;Based on &lt;a href=&quot;https://github.com/ketodiet/keto-calculator&quot;&gt;KetoDiet calculator&lt;/a&gt;&lt;/span&gt;
                    </div>
                </div>

                <h2>Typical Example</h2>
                <div>Macronutrient calculation for:
                    <ul>
                        <li>{exampleData.age} year old female,</li>
                        <li>weighing {exampleData.weight} kg,</li>
                        <li>{exampleData.height} cm tall,</li>
                        <li>{exampleData.bodyfat}% bodyfat,</li>
                        <li>sendenary</li>
                    </ul>
                    Net carbohydrate daily limit of <strong>{exampleData.netCarbs}g</strong> and a desired calorie deficit of <strong>{-calorieAdjustment}%</strong> (below maintenance)
                </div>

                <h3>Code</h3>
                <div className="code">
                    <pre>
                        var exampleData = &#123;{"\n"}
                        {"\t"}gender: core.Gender.FEMALE,{"\n"}
                        {"\t"}age: {exampleData.age},{"\n"}
                        {"\t"}weight: {exampleData.weight},{"\n"}
                        {"\t"}bodyfat: {exampleData.bodyfat},{"\n"}
                        {"\t"}height: {exampleData.height},{"\n"}
                        {"\t"}activityLevel: {exampleData.activityLevel},{"\n"}
                        {"\t"}netCarbs: {exampleData.netCarbs}{"\n"}
                        &#125;;{"\n"}

                        var calorieAdjustment = {calorieAdjustment};{"\n"}

                        var kdb = new core.KetoDietBuddy(exampleData);{"\n"}
                        var result = kdb.calculateCalorieIntake(calorieAdjustment);{"\n"}
                    </pre>
                </div>

                <h3>Calculated Basal Metabolic Rate (BMR): {Math.round(kdb.bmr)} kcal</h3>

                <h3>Calculated values for maintenance level</h3>
                <ResultsSection result={typicalResult.maintenance} />

                <h3>Calculated values for desired calorie deficit</h3>
                <ResultsSection result={typicalResult.desirable} />

                <h2>Try it for yourself - enter your own data</h2>
                <InputForm params={this.state.params}
                           others={this.state.others} updateParams={this.updateParams.bind(this)} updateOthers={this.updateOthers.bind(this)}/>
                <h3>Results</h3>
                <Results params={this.state.params}
                         others={this.state.others}/>
            </div>
		);
	}
}

class InputForm extends React.Component {

    updateGender(newValue) {
        this.props.params.gender = (newValue === core.Gender.MALE) ? core.Gender.MALE : core.Gender.FEMALE;
        this.props.updateParams(this.props.params);
    }
    updateAge(newValue) {
        this.props.params.age = newValue;
        this.props.updateParams(this.props.params);
    }
    updateWeight(newValue) {
        this.props.params.weight = newValue;
        this.props.updateParams(this.props.params);
    }
    updateHeight(newValue) {
        this.props.params.height = newValue;
        this.props.updateParams(this.props.params);
    }
    updateActivityLevel(newValue) {
        this.props.params.activityLevel = newValue;
        this.props.updateParams(this.props.params);
    }
    updateBodyfat(newValue) {
        this.props.params.bodyfat = newValue;
        this.props.updateParams(this.props.params);
    }
    updateNetCarbs(newValue) {
        this.props.params.netCarbs = newValue;
        this.props.updateParams(this.props.params);
    }
    updateCalorieAdjustment(newValue) {
        this.props.others.calorieAdjustment = newValue;
        this.props.updateOthers(this.props.others);
    }

    render() {
        return (
            <form>

                <InputFormGenderField fieldId="gender" value={this.props.params.gender} updateValue={this.updateGender.bind(this)} />
                <InputFormNumberField fieldId="age" title="Age" value={this.props.params.age} updateValue={this.updateAge.bind(this)} />
                <InputFormNumberField fieldId="weight" title="Weight (Kg)" value={this.props.params.weight} updateValue={this.updateWeight.bind(this)} />
                <InputFormNumberField fieldId="bodyfat" title="Body Fat (%)" value={this.props.params.bodyfat} updateValue={this.updateBodyfat.bind(this)} />
                <InputFormNumberField fieldId="height" title="Height (cm)" value={this.props.params.height} updateValue={this.updateHeight.bind(this)} />
                <InputFormNumberField fieldId="activityLevel" title="Activity Level (0 - 1)" value={this.props.params.activityLevel} updateValue={this.updateActivityLevel.bind(this)} />
                <InputFormNumberField fieldId="netCarbs" title="Net Carbs Limit (g)" value={this.props.params.netCarbs} updateValue={this.updateNetCarbs.bind(this)} />

                <InputFormNumberField fieldId="calorieAdjustment" title="Calorie Adjustment (%)" value={this.props.others.calorieAdjustment} updateValue={this.updateCalorieAdjustment.bind(this)} />

            </form>
        );
    }
}

class InputFormGenderField extends React.Component {
    update(event) {
        try {
            var newValue = parseInt(event.target.value);
            this.props.updateValue(newValue);
        } catch(ex) {
            console.error(ex);
        }
    }

    render() {
        var idFemale = this.props.fieldId + "_female";
        var idMale = this.props.fieldId + "_male";

        return (
            <div>
                <input type="radio" name={idFemale}
                       value={core.Gender.FEMALE}
                       checked={this.props.value === core.Gender.FEMALE}
                       onChange={this.update.bind(this)}
                />
                <label for={idFemale}>Female</label>

                <input type="radio" name={idMale}
                       value={core.Gender.MALE}
                       checked={this.props.value === core.Gender.MALE}
                       onChange={this.update.bind(this)} />
                <label for={idMale}>Male</label>
            </div>
        );
    }
}

class InputFormNumberField extends React.Component {

    update(event) {
        try {
            var newValue = parseFloat(event.target.value);
            this.props.updateValue(newValue);
        } catch(ex) {
            console.error(ex);
        }
    }

    toNumber(value) {
        return isNaN(value) || value === undefined ? 0 : value;
    }

    render() {
        return (
            <div>
                <label for={this.props.fieldId}>{this.props.title}</label>
                <input type="text" name={this.props.fieldId} value={this.toNumber(this.props.value)} onChange={this.update.bind(this)}/>
            </div>
        );
    }
}

class Results extends React.Component {
    render() {

        try {
            var kdb = new core.KetoDietBuddy(this.props.params);
            var result = kdb.calculateCalorieIntake(this.props.others.calorieAdjustment);
            var textResult = JSON.stringify(result, null, 4);

            var calorieAdjustment = (result.adjustment < 0) ? -result.adjustment + "% deficit" : result.adjustment + "% surplus";
            var warnings = "";
            if ((result.warnings & core.Warnings.LOW_BODYFAT) == core.Warnings.LOW_BODYFAT) {
                warnings += "Bodyfat too low, ";
            }
            if ((result.warnings & core.Warnings.LOW_CALORIES) == core.Warnings.LOW_CALORIES) {
                warnings += "Calorie intake too low, ";
            }
            if ((result.warnings & core.Warnings.LOW_FATGRAMS) == core.Warnings.LOW_FATGRAMS) {
                warnings += "Fat intake too low, ";
            }
            if ((result.warnings & core.Warnings.HIGH_CARBS) == core.Warnings.HIGH_CARBS) {
                warnings += "Carb intake too high, ";
            }

            if (warnings.length == 0) {
                warnings = "none -- all good";
            }

            return (
                <div>
                    <table>
                        <tbody>
                            <ResultsSectionItem name="Calorie Desirable Adjustment" value={calorieAdjustment}/>
                            <ResultsSectionItem name="Warnings" value={warnings}/>
                        </tbody>
                    </table>
                    <h4>Calculated Basal Metabolic Rate (BMR): {Math.round(kdb.bmr)} kcal</h4>
                    <h4>Minimum</h4>
                    <ResultsSection result={result.minimum} />
                    <h4>Maintenance</h4>
                    <ResultsSection result={result.maintenance} />
                    <h4>Desirable</h4>
                    <ResultsSection result={result.desirable} />
                    <h4>Raw Results Object</h4>
                    <textarea readOnly cols="64" rows="40" value={textResult} />
                </div>
            )
        } catch (ex) {
            return (
                <div>
                    <textarea readOnly cols="64" rows="42" value={ex} />
                </div>
            )
        }
    }
}

class ResultsSection extends React.Component {
    render() {
        var energy = this.props.result.energy + " kcal";
        var macroGrams =  this.props.result.gramsFat + "g, " + this.props.result.gramsProtein + "g, " + this.props.result.gramsNetCarbs + "g";
        var macroEnergy =  this.props.result.energyFat + " kcal, " + this.props.result.energyProtein + " kcal, " + this.props.result.energyNetCarbs + " kcal";
        var macroPercEnergy =  this.props.result.percEnergyFat + "%, " + this.props.result.percEnergyProtein + "%, " + this.props.result.percEnergyNetCarbs + "%";

        return (
            <table>
                <tbody>
                    <ResultsSectionItem name="Energy" value={energy}/>
                    <ResultsSectionItem name="Fat/ Protein/ Net Carbs grams" value={macroGrams}/>
                    <ResultsSectionItem name="Fat/ Protein/ Net Carbs energy" value={macroEnergy}/>
                    <ResultsSectionItem name="Fat/ Protein/ Net Carbs %" value={macroPercEnergy}/>
                </tbody>
            </table>
        )
    }
}

class ResultsSectionItem extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.name}</td><td>{this.props.value}</td>
            </tr>
        )
    }
}

ReactDOM.render(<App/>, document.querySelector("#app"));
