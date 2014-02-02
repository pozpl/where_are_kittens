package Auth::Login::RegistrationController;

use Moose;
use JSON;

use Auth::UserRepository;
use Auth::User;

has 'user_repository' => (
    'is'  => 'ro',
    'isa' => 'Auth::UserRepository',
    'required' => 1,
);

sub register_user(){
    my ($self, $request) = @_;
    my $user_json_string =  $request->content;

    my $user_json = JSON->new->decode($marker_json_string);
    my $user_to_save = $self->_user_to_marker($user_json);

    my $saved_user = $self->user_repository->save_user($user_to_save);
    return JSON->new->encode($self->_user_to_hash($saved_user));
}

sub _hash_to_user(){
    my ($self, $user_hash) = @_;

    $user = Auth::User->new(
        'id' => $user_hash->{'id'},
        'login' => $user_hash->{'login'},
        'email' => $user_hash->{'email'},
        'friendly_name' => $user_hash->{'friendly_name'},
        'provider' => Auth::User->internal_provider,
        'password' => $user_hash->{'password'}
    );

    return $user;
}

sub _user_to_hash(){
    my ($self, $user) = @_;

    $user_hash = {
        'id'    => $user->id,
        'login' => $user->login,
        'email' => $user->email,
        'friendly_name' => $user->friendly_name,
        'provider' => $user->provider,
    };


    return $user_hash;
}