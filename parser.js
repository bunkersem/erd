function parserGo() {
    var tree = graph.attributes.cells.models
        .filter(m =>
            m.attributes.type === 'html.Element'
        )
        .map(m => {
            return {
                title: m.attributes.input.slice(0),
                props: m.attributes.props.slice(0)
            }
        })

    console.log(tree);
    var tables = tree.map(m => generateTable(m));
    console.log(tables);
    console.log(graph);
    $('#output').html(tables);




    function generateTable(tableModel) {
        console.log(contents)
        var contents = tableModel.props
            .split('\n')
            .map(p => p.trim());
        console.log(contents);
        return `
CREATE TABLE ${tableModel.title} (
    ${contents.join(',\n    ')}
);
`
    }

}
parserGo();