import React from 'react';
import Ckeditor from 'ckeditor4-react';

export default class Editor extends React.Component {
    render() {
        Ckeditor.editorUrl = 'https://cdn.ckeditor.com/4.16.0/standard/ckeditor.js';
        return (
            <Ckeditor
                onBeforeLoad={ ( CKEDITOR ) => ( CKEDITOR.disableAutoInline = true ) } 
                onChange={this.props.funcUpdate}
                data={this.props.contenido}
                config={{                    
                    contentsCss: ['/static_files/ckeditor.css'],
                    removeDialogTabs: 'link:advanced',
                    uiColor: '#768b99',
                    youtube_responsive: true,
                    width: '85%',
                    toolbarGroups: [
                        { name: 'document', groups: ['mode', 'document', 'doctools'] },
                        { name: 'clipboard', groups: ['clipboard', 'undo'] },
                        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
                        { name: 'forms', groups: ['forms'] },
                        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
                        { name: 'links', groups: ['links'] },
                        { name: 'insert', groups: ['insert'] },
                        { name: 'styles', groups: ['styles'] },
                        { name: 'colors', groups: ['colors'] },
                        { name: 'tools', groups: ['tools'] },
                        { name: 'others', groups: ['others'] },
                        { name: 'about', groups: ['about'] }
                    ],
                    removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Subscript,Superscript,BulletedList,NumberedList,Outdent,Indent,Unlink,Link,About'
                }}
            />
        )
    }
}