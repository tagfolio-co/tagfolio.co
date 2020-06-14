import React from 'react'
import {Repos} from './Repos'

export class Portfolio extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name:''
        }
    }

    render(){
        let username = this.props.username

        return(
            <div id='Portfolio'>
                <div id='Intro'>
                    <h1 id='name'>{this.state.name}</h1>
                    <p>{username}</p>
                </div>

                <Repos github={username}/>
            </div>
        )
    }

    async getUser(username){
        let url = 'https://api.github.com/users/' + username
        let user = await fetch(url)
        return user.json()
    }

    async getEvents(username){
        let url = 'https://api.github.com/users/'+username+'/events'
        let events = await fetch(url)
        return events.json()
        
    }
    
    async componentDidMount(){
        let username = this.props.username
        let user = await this.getUser(username)
        let events = await this.getEvents(username)

        // scrape email        
        for (let i = 0; i<events.length; i++){
            let event = events[i]
            event['payload'] && 
            event['payload']['commits'] && 
            Object.keys(event['payload']['commits']).map(commit => {
                commit = event['payload']['commits'][commit]
                commit['author']['name'] === user.name &&
                commit['author']['email'] &&
                console.log(commit['author']['email'])
            })
        }

        this.setState({
            name: user.name
        })
    }
}








