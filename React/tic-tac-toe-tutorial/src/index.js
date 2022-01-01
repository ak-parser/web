import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Dictaphone, numbers_en_US, numbers_uk_UA} from './speech';

document.title = "Tic-Tac-Toe"

function Square(props) {
    let className = props.value.indexOf('W') !== -1 ? 'square square-winner' : 'square';
    if (props.value.indexOf('X') !== -1)
        className += ' square-x';
    else if (props.value.indexOf('O') !== -1)
        className += ' square-o';

    return (
        <button className={className} onClick={props.onClick}>
            {props.value.replace('W', '')}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square key={i} value={this.props.squares[i]}
                       onClick={() => this.props.onClick(i)}/>;
    }

    render() {
        const board = Array(3).fill(0).map((elem, index) => {
            let rowSquare = Array(0);
            for (let i = index * 3; i < index * 3 + 3; i++)
                rowSquare.push(this.renderSquare(i));
            return (
                <div key={index} className="board-row">{rowSquare}</div>
            );
        });

        return (
            <div>
                {board}
            </div>
        );
    }
}

function Moves(props) {
    return (
            <ol>{props.children}</ol>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(''),
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (squares[i] || calculateWinner(squares))
            return;

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    handleSpeech(text) {
        let i = parseInt(text, 10);

        if (isNaN(i))
        {
            for (i = 0; i < numbers_en_US.length; i++)
                if (text.toLowerCase().includes(numbers_en_US[i]) || text.toLowerCase().includes(numbers_uk_UA[i]))
                    break;
        }
        else
            i--;

        i < numbers_en_US.length && this.handleClick(i);
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc;
            if (move)
            {
                const cord = step.squares.findIndex((elem, index) => {
                    return(
                    elem !== history[move - 1].squares[index]
                )});
                desc = 'Go to move #' + move + ' Coords: ' + Math.trunc(cord / 3 + 1) + ', ' + (cord % 3 + 1);
            }
            else
                desc = 'Go to game start';

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner)
            status = winner === 'D' ? 'Draw' : 'Winner: ' + winner;
        else
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                           onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <Moves>{moves}</Moves>
                    <Dictaphone onSpeech={(text) => this.handleSpeech(text)}>{}</Dictaphone>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    let flag = true;

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[b] && squares[c])
        {
            if (squares[a] === squares[b] && squares[a] === squares[c]) {
                const winner = squares[a];
                squares[a] = squares[b] = squares[c] += 'W';
                return winner;
            }
        }
        else
            flag = false;
    }

    if (flag) {
        alert("Draw");
        return 'D';
    }

    return null;
}