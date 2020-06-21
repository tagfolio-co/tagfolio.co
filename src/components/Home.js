import React from 'react';

export function Home() {
    return (
        <div id='Home'>
            <HomeIntro />
            <Search />
            <Docs />
        </div>
    )
}

function HomeIntro() {
    return (
        <div id='Intro'>
            <div id='callToAction'>
                <h1>Build beautiful portfolios in seconds</h1>
                <h2>See what we’re talking about</h2>
                <br />
                <h2>&#9660;</h2>
            </div>
        </div>
    )
}

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: ''
        }

        this.updateUsername = this.updateUsername.bind(this)
    }

    updateUsername(e) {
        this.setState({ userName: e.target.value })
    }

    render() {
        return (
            <div id='Search'>
                <SearchBox handleChange={this.updateUsername} goToPortfolio={this.goToPortfolio}/>
                <SearchButton userName={this.state.userName} />
            </div>
        );
    }
}


function SearchBox(props) {
    let handleKeyDown = (e) => {
        let [key, userName] = [e.key, e.target.value]
        key === 'Enter' && (window.location.href = '/?' + userName)
    }

    return <input type='text' onChange={props.handleChange} onKeyDown={handleKeyDown} placeholder='GitHub Username'/>
}

function SearchButton(props) {
    let url = '/?' + props.userName
    return <a href={url}><i className="material-icons">search</i></a>
}



function Docs(){

    return (
        <div id='Docs'>
            <h1>How does this work?</h1>
            <p>We use GitHub's APIs to build you a portfolio based on your public repos.</p>
            
            <h1>How does custom tagging work?</h1>
            <p>Just add <span style={{color:'#78D5D7', fontWeight:'bolder'}}>#customTags</span> to repository descriptions, and the tags will be pulled in automatically.</p>

            <h1>Can I hide some of my repos?</h1>
            <p>Yep! Just add <span style={{color:'#78D5D7', fontWeight:'bolder'}}>[x]</span> to the end of the repo's description to prevent it from being displayed.</p>

        </div>
    )
}