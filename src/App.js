import React from "react";
import WordsData from "./data/words";
import "./styles.css";
import "./tailwindcss.css";

const classNames = require("classnames");

export default class App extends React.Component {
  state = {
    words: [],
    input: "",
    timer: 60,
    keystrokes: 0,
    wordIndex: 0,
    interval: null,
    game: {
      start: false,
      over: false
    }
  };

  getNewWords = () => {
    let list = [];
    for (let i = 0; i < 120; i++) {
      const random = Math.floor(Math.random() * WordsData.length - 1);
      list.push(WordsData[random]);
    }

    list = list.map(el => ({ value: el, hit: null }));

    this.setState({ words: list });
  };

  startGame = () => {
    let { game, timer } = this.state;

    if (!game.start) {
      game.start = true;
      this.setState({
        game: { ...game },
        interval: setInterval(() => {
          --timer;
          this.setState({ timer });

          if (timer === 0 || game.over) {
            this.endGame();
          }
        }, 1000)
      });
    }
  };

  endGame = () => {
    let { game, interval, input } = this.state;
    clearInterval(interval);
    game.over = true;
    input = "";
    this.setState({
      game: { ...game },
      input
    });
  };

  restartGame = () => {
    this.getNewWords();
    this.endGame();

    const game = { start: false, over: false };

    this.setState({
      game,
      timer: 60,
      wordIndex: 0
    });
  };

  handleInput = event => {
    this.startGame();
    if (event.keyCode.toString().match(/(32|13)/)) {
      this.handleSubmit(event);
    }
  };

  handleSubmit = event => {
    let { input, words, wordIndex, game, keystrokes } = this.state;
    event.preventDefault();

    if (!game.over) {
      // Update current word before moving over
      if (input === words[wordIndex].value) {
        words[wordIndex].hit = true;
        keystrokes += words[wordIndex].value.length;
        this.setState({ words });
      } else {
        words[wordIndex].hit = false;
      }

      wordIndex++;
      input = "";
      this.setState({
        wordIndex,
        input,
        keystrokes
      });
    }
  };

  getWordStatusClassName = status => {
    if (status === true) return "hit";
    if (status === false) return "miss";
  };

  componentDidMount() {
    this.getNewWords();
  }

  render() {
    const { input, words, timer, game, keystrokes, wordIndex } = this.state;

    return (
      <div className="font-sans text-gray-800 px-4 h-full">
        <div className="max-w-lg mx-auto pt-10">
          <h1 className="text-5xl font-black mb-4 text-center">TypeApp</h1>
          <p className="text-center mb-4">Start typing to play. Press "space" or "enter" to submit.</p>

          <div className="flex justify-center mb-12">
            <button onClick={this.restartGame} className="rounded p-2 border border-gray-300 text-xs">
              Restart
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              className="block w-full rounded-lg shadow-lg p-4 mb-12 text-lg outline-none"
              value={input}
              disabled={game.over}
              onChange={e => this.setState({ input: e.target.value })}
              onKeyDown={e => this.handleInput(e)}
            />

            <div className="absolute top-0 right-0 pt-5 pr-5">{timer}</div>
          </div>

          <div className="word-container text-4xl text-center text-gray-400">
            {!game.over &&
              words.map((word, index) => (
                <div
                  className={classNames({
                    word: true,
                    hit: word.hit === true,
                    miss: word.hit === false,
                    "text-5xl text-gray-800": wordIndex === index,
                    "word-hidden": wordIndex > index
                  })}
                  key={index}
                >
                  {word.value}
                </div>
              ))}
            {game.over && (
              <div className="text-center text-xl">
                WPM: <span className="font-bold">{keystrokes / 5}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
