var Olympiad = React.createClass({
    toggleCheck: function() {

    },

    render: function() {
        var returnValue = <p>{this.props.olympiadName}</p>;

        return returnValue;
    }
});

var Subject = React.createClass({
    getInitialState: function() {
        return {toggled: false};
    },

    handleClick: function(e) {
        this.setState({toggled: !this.state.toggled});
        console.log(this.state.toggled);
    },

    render: function() {
        var olympList = [];
        for(var index in this.props.olympList) {
            olympList.push(
                (
                    <Olympiad olympiadName={this.props.olympList[index]} />
                )
            );
        }

        var togglingStyle = this.state.toggled ? {} : {display: "none"};

        return (
            <div onClick={this.handleClick}>
                <h1>{this.props.subjectName}</h1>
                <div style={togglingStyle}>{olympList}</div>
            </div>
        );
    }
})

var TrialContainer = React.createClass({
    componentWillMount: function() {
        console.log("kkw");
    },

    render: function() {
        console.log(this.props.data);

        var subjectsArray = [];
        for(var subj in this.props.data) {
            subjectsArray.push(
                (
                    <Subject subjectName={subj} olympList={this.props.data[subj]} />
                )
            );
        };

        var returnValue = <div>{subjectsArray}</div>;
        return returnValue;
    }
});

$.get('/test/api', function (result) {
    ReactDOM.render(
        <TrialContainer data={JSON.parse(result)} />,
        document.getElementById('trial')
    );
});
