const babelLoader = {
    loaders: [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            query: {
                presets: ['es2015', 'react', 'stage-0']
            }
        }
    ]
};

// multiple file path configuration for later versions
module.exports = [
    {
        entry: './src/inject/inject.js',
        output: {
            filename: './build/src/inject/inject.js'
        },
        module: babelLoader
    },
    {
        entry: './src/bg/background.js',
        output: {
            filename: './build/src/bg/background.js'
        },
        module: babelLoader
    },
    {
        entry: './src/page_action/page_action.js',
        output: {
            filename: './build/src/page_action/page_action.js'
        },
        module: babelLoader
    }
];

