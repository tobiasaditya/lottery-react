import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

    //ES16 syntax
    state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message: ''
    };

    //Before ES16 syntax
    // constructor(props) {
    //     super(props)
    //     this.state = { manager: '' }
    // }


    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({ manager: manager, players: players, balance: balance })
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();

        //Karena butuh waktu, perlu kasih feedback ke user
        this.setState({ message: "Processing transaction..." })

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });
        this.setState({ message: "You have been entered!" })


    }

    onClick = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();

        //Karena butuh waktu, perlu kasih feedback ke user
        this.setState({ message: "Processing transaction..." })

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        this.setState({ message: 'A winner has been picked' })

    }
    render() {
        return (
            <div>
                <h2>Lottery Contract</h2>
                <p>
                    This contract is managed by {this.state.manager}.
                    There are currently {this.state.players.length} people entered, competing to win to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
                </p>
                <hr></hr>
                <form onSubmit={this.onSubmit}>
                    <h4>
                        Want to try your luck?
                        <div>
                            <label>Amount of ether to enter</label>
                            <input
                                value={this.state.value}
                                onChange={(event) => this.setState({ value: event.target.value })}>

                            </input>
                        </div>

                        <button>Enter</button>
                    </h4>
                </form>
                <hr></hr>

                <h4>Ready to pick a winner?</h4>
                <button onClick={this.onClick}>Pick</button>

                <hr></hr>
                {this.state.message}
            </div>
        );

    }


}

export default App;