var Olympiad = React.createClass({
    getInitialState: function () {
        return {checked: false};
    },

    toggleCheck: function() {
        this.props.handleCheck(this.props.olympiadName);
        this.setState({checked: !this.state.checked});
    },

    render: function() {
        let checked = this.state.checked ? 'x' : '';

        var returnValue = (
            <div className="olymp-cnt">
                <p className="olymp-name" onClick={this.toggleCheck}>{this.props.olympiadName}</p>
                <p className="olymp-counter">{checked}</p>
            </div>
        );

        return returnValue;
    }
});

var Subject = React.createClass({
    getInitialState: function() {
        let olympState = {};

        for (var index in this.props.olympList) {
            olympState[this.props.olympList[index]] = false;
        }

        return {toggled: false, checkedCount: 0, olympState: olympState};
    },

    handleClick: function(e) {
        this.setState({toggled: !this.state.toggled});
        //console.log(this.state.toggled);
    },

    handleCheck: function(olympName) {
        var olympState = this.state.olympState;
        olympState[olympName] = !olympState[olympName];

        if (olympState[olympName])
            this.setState({checkedCount: this.state.checkedCount + 1, olympState: olympState});
        else
            this.setState({checkedCount: this.state.checkedCount - 1, olympState: olympState});

        this.props.passChange(this.props.subjectName, olympState);
    },

    render: function() {
        var counterString = (this.state.checkedCount == 0) ? "" : "" + this.state.checkedCount;
        var olympList = [];
        for(var index in this.props.olympList) {
            olympList.push(
                (
                    <Olympiad olympiadName={this.props.olympList[index]} handleCheck={this.handleCheck}/>
                )
            );
        }

        var togglingStyle = this.state.toggled ? {} : {display: "none"};

        return (
            <div className="subject-cnt">
                <div onClick={this.handleClick} className="subject-cnt-header">
                    <h1>{this.props.subjectName}</h1>
                    <p>{counterString}</p>
                </div>
                <div className="olymp-list-cnt" style={togglingStyle}>{olympList}</div>
            </div>
        );
    }
})

var TrialContainer = React.createClass({
    getInitialState: function() {
        var totalState = {};
        for(var subject in this.props.data) {
            totalState[subject] = {};
            for(var olympName in this.props.data[subject]) {
                  totalState[subject][olympName] = false;
            }
        }
        return {totalState: totalState};
    },

    handleChange: function (subjectName, subjectState) {
        var totalState = this.state.totalState;
        totalState[subjectName] = subjectState;
        this.setState({totalState: totalState});
        //console.log(JSON.stringify(this.state.totalState));
    },

    submit: function() {
        var checkedOlymps = {};
        for (var subj in this.state.totalState) {
            checkedOlymps[subj] = [];
            for (var olymp in this.state.totalState[subj]) {
                if (this.state.totalState[subj][olymp]) {
                    checkedOlymps[subj].push(olymp);
                }
            }
        }
        console.log(JSON.stringify(checkedOlymps));
    },

    render: function() {
        //console.log(this.props.data);

        var subjectsArray = [];
        for(var subj in this.props.data) {
            subjectsArray.push(
                (
                    <Subject subjectName={subj} passChange={this.handleChange} olympList={this.props.data[subj]} />
                )
            );
        };

        var returnValue = (
            <div className="trial-cnt">
                <div className="trial-subj-list">{subjectsArray}</div>
                <button className="trial-submit-btn" onClick={this.submit}>Push</button>
            </div>
        );
        return returnValue;
    }
});

$.get('/test/api', function (result) {
    ReactDOM.render(
        <TrialContainer data={JSON.parse(result)} />,
        document.getElementById('trial')
    );
});
