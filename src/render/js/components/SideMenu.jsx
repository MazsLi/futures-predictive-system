import React from 'react';
const debug = require('debug')('sidebar');
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { throttle } from 'react-decoration';

class SideMenu extends React.Component {

    state = {
        items: this.props.items,
        clickEvent: this.props.click,
        current: (this.props.items)? this.props.items[0].key: null,
    }

    @throttle(500) // 每500ms只能觸發一次
    handleItemClick(key) {
        debug('click:' + key);
        this.state.clickEvent(key);
        this.setState({ current: key });
    }

    render() {

        debug('render...');

        let { items, current } = this.state;
        let itemsComp = [];

        items.map( (obj, index) => {

            let itemStyle = {
                borderRight: (obj.key===current)? '5px solid cadetblue': '',
            }

            itemsComp.push(
                <ListItem key={index} button onClick={this.handleItemClick.bind(this, obj.key)} style={itemStyle}>
                    <ListItemIcon>
                        { obj.icon }
                    </ListItemIcon>
                    <ListItemText primary={obj.name} />
                </ListItem>
            )
        })

        return (
            <div>
                <List>
                    <Divider />
                    {itemsComp}
                    <Divider />
                </List>
            </div>
        )
    }
}

export default SideMenu;