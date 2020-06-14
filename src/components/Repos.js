import React from 'react'

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
        //api = './repos.json'
        let repos = await this.getRepos(api)

        let reposToDisplay = []
        let tagList = {}
        let i = -1

        while (i < repos.length-1){
            i++
            
            let repo = repos[i]
            let name = repo['name']
            let desc = repo['description']
            let url = repo['html_url']

            // only show repos with descriptions
            if (!desc) continue
    
            // exclude repos with [x] at the end of the description
            let descLen = desc.length
            let exclude = desc.substring(descLen - 3).toLowerCase() === '[x]'
            if (exclude) continue
            
            // save the repo info to display later
            reposToDisplay[name] = [desc,url]
            
            // check to see if the repo has any tags
            let tags = desc.match(/#\S+/g)

            if (tags){
                tags.map(tag => {
                    // tag.substr(1) removes the #
                    // error thrown for tag = tag.substr(1) so RIP DRY

                    // add the tag if it doesn't exist
                    (!tagList[tag.substr(1)]) && (tagList[tag.substr(1)] = [])

                    // associate the repo with it's tags
                    tagList[tag.substr(1)].push(name)
                    return null
                })
            } else {
                 console.log('It looks like',name,'doesn\'t have any tags!')
            }
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
            let [desc,url] = repos[name]

            // show all tags
            let shown = 'true'

            if (props.visableRepos !== undefined){
                // is this repo tagged with the currently selected tag?
                shown = props.visableRepos.includes(name) ? 'true' : 'false'
            }
            return (
                <a href={url} className='repo' shown={shown} key={name+'-'+i}>
                <div>
                    <h3>{name}</h3>
                    <p>{desc}</p>
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