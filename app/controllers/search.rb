get '/' do
	erb :"search/index"
end

post '/search' do
	if request.xhr?
		p params
		params.to_json
	end
end