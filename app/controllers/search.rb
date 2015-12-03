get '/' do
	erb :"search/index"
end

post '/search' do
	params.to_json
end