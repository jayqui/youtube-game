get '/' do
	erb :"search/index"
end

post '/search' do
	# if request.xhr?
	# p "params: #{params}"
	yt = YouTubeSearch.new
	qa = yt.search_query(params[:data],10)
	qa.to_json
	# end
end