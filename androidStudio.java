final TextView mTextView = (TextView) findViewById(R.id.text);

RequestQueue queue = Volley.newRequestQueue(this);
String url ="http://www.google.com";

StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    mTextView.setText("Response is: "+ response.substring(0,500));
                },{
                  new Response.ErrorListener() {
                  @Override
                  public void onErrorResponse(VolleyError error) {
                      mTextView.setText("That didn't work!");
                  }
});

queue.add(stringRequest);
