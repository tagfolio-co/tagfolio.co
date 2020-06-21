import React from 'react'
import RepoAPI from '../APIJson/repos.json'
//import RepoAPI from '../APIJson/reposJosh.json'

export class Repos extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            repos : {},
            tagList:{},
            tagSelected:'All'
        }

        this.updateSelectedTag = this.updateSelectedTag.bind(this)
    }
    

    render(){

        return (
            <div className='Repos'>
                <TagList 
                    tags={this.state.tagList}
                    selectedTag={this.state.tagSelected}
                    updateSelectedTag={this.updateSelectedTag}
                />

                <RepoList 
                    repos={this.state.repos} 
                    visableRepos={this.state.tagList[this.state.tagSelected]}
                />

            </div>
        )
    }
    
    updateSelectedTag(newTag){
        this.setState({tagSelected:newTag})
    }

    async getRepos(url){
        let repos = await fetch(url)
        return repos.json()
    }
    
    async componentDidMount(){
        let api = 'https://api.github.com/users/'+this.props.github+'/repos?sort=created'
        
        // use this for dev
        // let repos = RepoAPI
        
        let repos = await this.getRepos(api)

        let reposToDisplay = []
        let tagList = {}
        let i = -1

        while (i < repos.length-1){
            i++
            
            let repo = repos[i]
            let name = repo['name']
            let desc = repo['description']
            let lang = repo['language']
            let url = repo['html_url']

            // only show repos with descriptions
            if (!desc) continue
    
            // exclude repos with [x] at the end of the description
            let descLen = desc.length
            let exclude = desc.substring(descLen - 3).toLowerCase() === '[x]'
            if (exclude) continue
            
            // check to see if the repo has any tags
            let tags = desc.match(/#\S+/g) || []
            let thisTagList = []

            // make sure there will be tags to associate
            if (tags || lang){
                // add lang to tags
                tags.push('#' + lang)
                
                tags.map(tag => {
                    // remove '#'
                    tag = tag.slice(1)
                        
                    // tag consistency
                    switch(tag.toUpperCase()){
                        case 'JS': tag = 'JavaScript';
                        case 'HTML': tag = 'HTML';
                        case 'CSS': tag = 'CSS';
                    }

                    tag = tag.charAt(0).toUpperCase() + tag.slice(1)
                    
                    if (tag.toUpperCase() !== 'NULL'){

                        // add the tag if it doesn't exist
                        !tagList[tag] && (tagList[tag] = [])
                        !thisTagList.includes(tag) && (thisTagList.push(tag))
                        
                        // associate the repo with it's tags
                        tagList[tag].push(name)
                    }
                    return null
                })
            }

            // save the repo info to display later
            reposToDisplay[name] = [desc, url, thisTagList]
        }


        this.setState({
            repos:reposToDisplay,
            tagList:tagList
        })
    }
}




// #### REPO LIST ####

function RepoList(props){
    let repoList = Object.keys(props.repos).map(
        (name,i) => {
            let repos = props.repos
            let [desc,url,tagList] = repos[name]


            tagList = tagList.map((tag, i) => <p key={i}>#{tag}</p>)

            let shown = props.visableRepos === undefined 
                ? 'true' 
                : props.visableRepos.includes(name) 
                    ? 'true' 
                    : 'false'
            
            
            return (
                <a href={url} className='repo' shown={shown} key={name+'-'+i}>
                <div>
                    <h3>{name}</h3>
                    <p>{desc}</p>
                    <div className='tags'>
                        {tagList}
                    </div>
                </div>
                </a>
            )
        }
    )


    return <div className='RepoWrapper'>{repoList}</div>
}






// #### TAG LIST ####

function TagList(props){
    let tags = Object.keys(props.tags).map(
        tag => {

            return (
                <Tags 
                    name={tag}  
                    updateSelectedTag={props.updateSelectedTag}
                    selectedTag={props.selectedTag}
                    key={tag}
                />
            )
        }
    )

    return (
        <div className='TagWrapper'>
            <div className='Tags'>
                <Tags 
                    name='All'
                    updateSelectedTag={props.updateSelectedTag}
                    selectedTag={props.selectedTag}
                    /> 
                {tags} 
            </div>
        </div>
    )
}


// #### TAGS ####

function Tags(props){
    let highlight = props.name === props.selectedTag ? 'true' : 'false'
    // console.log(props.name, props.selectedTag, highlight)

    return <a className='Tag' highlight={highlight} onClick={()=>{props.updateSelectedTag(props.name)}}>{props.name}</a>
}