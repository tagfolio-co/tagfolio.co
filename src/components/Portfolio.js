import React from 'react'
import {Repos} from './Repos'
import UserAPI from '../APIJson/user.json'
import EventAPI from '../APIJson/events.json'



export class Portfolio extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name:'',
            bio:'',
            email:'',
            blog:'',
        }
    }

    render(){
        let username = this.props.username
        let blog = this.state.blog.substring(0,4).toUpperCase() === 'HTTP' ? this.state.blog : 'http://' + this.state.blog
        blog = this.state.blog ? <a href={blog} title='Website'><i className="material-icons">web</i></a> : ''
        let email = this.state.email ? <a href={'mailto:' + this.state.email} title='Email'><i className="material-icons">email</i></a> : ''
        
        return(
            <div id='Portfolio'>
                <div id='Intro'>
                    <div>
                        <h1 id='name'>{this.state.name}</h1>
                        <p id='bio'>{this.state.bio}</p>
                        {blog}
                        {email}
                    </div>
                </div>

                <Repos github={username}/>
            </div>
        )
    }

    async getUser(username){
        let url = 'https://api.github.com/users/' + username
        // use this for dev
        // return UserAPI

        let user = await fetch(url)
        return user.json()
    }
    
    async getEvents(username){
        let url = 'https://api.github.com/users/'+username+'/events'
        
        // use this for dev
        // return EventAPI
        
        let events = await fetch(url)
        return events.json()
    }

    getEmail(name, events){
        for (let event in events){
            let commits = events[event]['payload']['commits']
            if(commits){
                for (let commit in commits ){
                    let author = commits[commit]['author'] || {name:'',email:''}
                    if (author['name'] === name && author['email']){
                        return author['email']
                    }
                }
            }
        }

        return ''
    }
    
    async componentDidMount(){
        let username = this.props.username
        let user = await this.getUser(username)
        let events = await this.getEvents(username)
        

        this.setState({
            name: user.name,
            bio: user.bio,
            blog: user.blog,
            email: this.getEmail(user.name, events)
        })
    }
}








